const buckets = new WeakMap();
const tngStack: any[] = [];

function getCurrentBucket(cb = () => {}) {
  if (tngStack.length > 0) {
    let tngf = tngStack[tngStack.length - 1];
    let bucket;
    if (!buckets.has(tngf)) {
      bucket = {
        nextStateSlotIdx: 0,
        nextEffectIdx: 0,
        nextMemoizationIdx: 0,
        stateSlots: [],
        effects: [],
        cleanups: [],
        memoizations: [],
        cb,
      };
      buckets.set(tngf, bucket);
    }

    return buckets.get(tngf);
  }
}

// NOTE: both `guards1` and `guards2` are either
//    `undefined` or an array
function guardsChanged(guards1: any[] | undefined, guards2: any[] | undefined) {
  // either guards list not set?
  if (guards1 === undefined || guards2 === undefined) {
    // force assumption of change in guards
    return true;
  }

  // guards lists of different length?
  if (guards1.length !== guards2.length) {
    // guards changed
    return true;
  }

  // check guards lists for differences
  //    (only shallow value comparisons)
  for (const [idx, guard] of guards1.entries()) {
    if (!Object.is(guard, guards2[idx])) {
      // guards changed
      return true;
    }
  }

  // assume no change in guards
  return false;
}

// ******************

export function TNG<T extends Function>(cb: any, ...fns: T[]) {
  fns = fns.map(function mapper(fn) {
    tngf.reset = reset;
    return tngf;

    // ******************

    function tngf(this: any, ...args: any[]) {
      tngStack.push(tngf);
      var bucket = getCurrentBucket(cb);
      bucket.nextStateSlotIdx = 0;
      bucket.nextEffectIdx = 0;
      bucket.nextMemoizationIdx = 0;

      try {
        return fn.apply(this, args);
      } finally {
        // run (cleanups and) effects, if any
        try {
          runEffects(bucket);
        } finally {
          tngStack.pop();
        }
      }
    }

    function runEffects(bucket: { effects: any[] }) {
      for (let [idx, [effect, guards]] of bucket.effects.entries()) {
        try {
          if (isFn(effect)) {
            effect();
          }
        } finally {
          bucket.effects[idx][0] = undefined;
        }
      }
    }

    function reset() {
      tngStack.push(tngf);
      var bucket = getCurrentBucket();
      try {
        // run all pending cleanups
        for (let cleanup of bucket.cleanups) {
          if (isFn(cleanup)) {
            cleanup();
          }
        }
      } finally {
        tngStack.pop();
        bucket.stateSlots.length = 0;
        bucket.effects.length = 0;
        bucket.cleanups.length = 0;
        bucket.memoizations.length = 0;
        bucket.nextStateSlotIdx = 0;
        bucket.nextEffectIdx = 0;
        bucket.nextMemoizationIdx = 0;
      }
    }
  }) as any;

  return fns; //fns.length < 2 ? fns[0] : fns;
}

export function useState<T extends Function | object | any>(initialVal: T) {
  var bucket = getCurrentBucket();
  if (bucket) {
    return useReducer(function reducer(prevVal: any, vOrFn: (arg0: any) => any) {
      return isFn(vOrFn) ? vOrFn(prevVal) : vOrFn;
    }, initialVal);
  } else {
    throw new Error('useState() only valid inside an Articulated Function or a Custom Hook.');
  }
}

export function useReducer(
  reducerFn: { (prevVal: any, vOrFn: any): any; (arg0: any, arg1: any): any },
  initialVal: Function | object | any,
  ...initialReduction: undefined[]
) {
  var bucket = getCurrentBucket();
  if (bucket) {
    // need to create this state-slot for this bucket?
    if (!(bucket.nextStateSlotIdx in bucket.stateSlots)) {
      let slot = [
        isFn(initialVal) ? initialVal() : initialVal,
        function updateSlot(v: any) {
          slot[0] = reducerFn(slot[0], v);
          bucket.cb();
        },
      ];
      bucket.stateSlots[bucket.nextStateSlotIdx] = slot;

      // run the reducer initially?
      if (initialReduction.length > 0) {
        bucket.stateSlots[bucket.nextStateSlotIdx][1](initialReduction[0]);
      }
    }

    return [...bucket.stateSlots[bucket.nextStateSlotIdx++]];
  } else {
    throw new Error('useReducer() only valid inside an Articulated Function or a Custom Hook.');
  }
}

export function useEffect(fn: () => any, ...guards: any[][] | [undefined]) {
  // passed in any guards?
  if (guards.length > 0) {
    // only passed a single guards list?
    if (guards.length == 1 && Array.isArray(guards[0])) {
      guards = guards[0];
    }
  }
  // no guards passed
  // NOTE: different handling than an empty guards list like []
  else {
    guards[0] = undefined;
  }

  var bucket = getCurrentBucket();
  if (bucket) {
    // need to create this effect-slot for this bucket?
    if (!(bucket.nextEffectIdx in bucket.effects)) {
      bucket.effects[bucket.nextEffectIdx] = [];
    }

    let effectIdx = bucket.nextEffectIdx;
    let effect = bucket.effects[effectIdx];

    // check guards?
    if (guardsChanged(effect[1], guards)) {
      // define effect handler
      effect[0] = function effect() {
        // run a previous cleanup first?
        if (isFn(bucket.cleanups[effectIdx])) {
          try {
            bucket.cleanups[effectIdx]();
          } finally {
            bucket.cleanups[effectIdx] = undefined;
          }
        }

        // invoke the effect itself
        var ret = fn();

        // cleanup function returned, to be saved?
        if (isFn(ret)) {
          bucket.cleanups[effectIdx] = ret;
        }
      };
      effect[1] = guards;
    }

    bucket.nextEffectIdx++;
  } else {
    throw new Error('useEffect() only valid inside an Articulated Function or a Custom Hook.');
  }
}

export function useMemo(fn: () => any, ...inputGuards: (any | { (): any })[]) {
  // passed in any input-guards?
  if (inputGuards.length > 0) {
    // only passed a single inputGuards list?
    if (inputGuards.length == 1 && Array.isArray(inputGuards[0])) {
      inputGuards = inputGuards[0];
    }
  }
  // no input-guards passed
  // NOTE: different handling than an empty inputGuards list like []
  else {
    // the function itself is then used as the only input-guard
    inputGuards = [fn];
  }

  var bucket = getCurrentBucket();
  if (bucket) {
    // need to create this memoization-slot for this bucket?
    if (!(bucket.nextMemoizationIdx in bucket.memoizations)) {
      bucket.memoizations[bucket.nextMemoizationIdx] = [];
    }

    let memoization = bucket.memoizations[bucket.nextMemoizationIdx];

    // check input-guards?
    if (guardsChanged(memoization[1], inputGuards)) {
      try {
        // invoke the to-be-memoized function
        memoization[0] = fn();
      } finally {
        // save the new input-guards
        memoization[1] = inputGuards;
      }
    }

    bucket.nextMemoizationIdx++;

    // return the memoized value
    return memoization[0];
  } else {
    throw new Error('useMemo() only valid inside an Articulated Function or a Custom Hook.');
  }
}

export function useCallback(fn: any, ...inputGuards: any[]) {
  if (getCurrentBucket()) {
    return useMemo(function callback() {
      return fn;
    }, ...inputGuards);
  } else {
    throw new Error('useCallback() only valid inside an Articulated Function or a Custom Hook.');
  }
}

export function useRef<T>(initialValue: T) {
  if (getCurrentBucket()) {
    // create a new {} object with a `current` property,
    // save it in a state slot
    var [ref] = useState({ current: initialValue });
    return ref;
  } else {
    throw new Error('useRef() only valid inside an Articulated Function or a Custom Hook.');
  }
}

////////////////////////////////////////////////////////

function isFn(fnOrO: Function | object) {
  return typeof fnOrO == 'function';
}

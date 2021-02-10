import { fnWrap } from './utils';

type Bucket = {
  /** nextStateSlotIdx */
  nSSI: number;

  /** nextEffectIdx */
  nEI: number;

  /** nextMemoizationIdx */
  nMI: number;

  /** stateSlots */
  sS: [any, any][];

  /** effects */
  e: any[];

  /** memoizations */
  m: any[];

  /** hasUpdatedState shows if a state was changed */
  hUS: boolean;

  /** cleanups */
  c: (Function | undefined)[];

  /** callback function */
  cb: Function;

  /** articulated function */
  af: Function;
};

const buckets = new WeakMap<Function, Bucket>();
const afStack: Function[] = [];

function getCurrentBucket() {
  const af = afStack[afStack.length - 1];
  const bucket = buckets.get(af);
  if (bucket !== undefined) {
    return bucket;
  } else {
    throw new Error('Hooks only valid inside an Articulated Function or a Custom Hook.');
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

////////////////////////////////////////////////////////

export function AF<T extends Function>(fns: T, cb: Function) {
  af.reset = reset;
  return af;

  function af(this: any, ...args: any[]) {
    afStack.push(af);

    let bucket = buckets.get(af);
    if (bucket == null) {
      bucket = {
        nSSI: 0,
        nEI: 0,
        nMI: 0,
        sS: [],
        e: [],
        c: [],
        m: [],
        hUS: false,
        cb,
        af: () => af(...args),
      };
      buckets.set(af, bucket);
    } else {
      bucket.nSSI = 0;
      bucket.nEI = 0;
      bucket.nMI = 0;
      bucket.af = () => af(...args);
    }

    let r;
    try {
      r = fns.apply(this, args);
    } finally {
      // run (cleanups and) effects, if any
      try {
        runEffects(bucket);

        return bucket.cb(r);
      } finally {
        if (bucket.hUS) {
          bucket.hUS = false;
          bucket.af();
        }

        afStack.pop();
      }
    }
  }

  function runEffects(bucket: Bucket) {
    for (let [idx, [effect]] of bucket.e.entries()) {
      try {
        fnWrap(effect);
      } finally {
        bucket.e[idx][0] = undefined;
      }
    }
  }

  function reset() {
    afStack.push(af);
    const bucket = getCurrentBucket();
    try {
      // run all pending cleanups
      for (let cleanup of bucket.c) {
        fnWrap(cleanup);
      }
    } finally {
      afStack.pop();
      bucket.sS.length = 0;
      bucket.e.length = 0;
      bucket.c.length = 0;
      bucket.m.length = 0;
      bucket.nSSI = 0;
      bucket.nEI = 0;
      bucket.nMI = 0;
      //TODO: cleanup af and cb
    }
  }
}

export function useState<T>(initialVal?: T | ((v: T) => T)): [T, (data: T | ((v: T) => T)) => T] {
  return useReducer<T>(function reducer(prevVal: T, vOrFn: (arg0: any) => T) {
    return fnWrap(vOrFn, [prevVal]);
  }, initialVal);
}

export function useReducer<T>(
  reducer: { (prevVal: any, vOrFn: any): any; (arg0: any, arg1: any): any },
  initialVal?: T | ((v: T) => T),
  ...initialReduction: undefined[]
): [T, (data: T | ((v: T) => T)) => T] {
  var bucket = getCurrentBucket();

  // need to create this state-slot for this bucket?
  if (!(bucket.nSSI in bucket.sS)) {
    let slot: [any, (v: any) => any] = [
      fnWrap(initialVal),
      function updateSlot(v: any) {
        slot[0] = reducer(slot[0], v);
        // if a state was changed:
        // - immediately => set the hasUpdatedState flat
        // - after main threat was done => invoke AF
        afStack.length > 0 ? (bucket.hUS = true) : bucket.af();
      },
    ];
    bucket.sS[bucket.nSSI] = slot;

    // run the reducer initially?
    if (initialReduction.length > 0) {
      bucket.sS[bucket.nSSI][1](initialReduction[0]);
    }
  }

  return [...bucket.sS[bucket.nSSI++]];
}

export function useEffect(fn: () => any, ...guards: any[][]) {
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
    guards = undefined as any;
  }

  const bucket = getCurrentBucket();

  // need to create this effect-slot for this bucket?
  if (!(bucket.nEI in bucket.e)) {
    bucket.e[bucket.nEI] = [];
  }

  let effectIdx = bucket.nEI;
  let effect = bucket.e[effectIdx];

  // check guards?
  if (guardsChanged(effect[1], guards)) {
    // define effect handler
    effect[0] = function effect() {
      // run a previous cleanup first?

      // if (typeof bucket.cleanups[effectIdx] == 'function') {
      try {
        // bucket.cleanups[effectIdx]();
        fnWrap(bucket.c[effectIdx]);
      } finally {
        bucket.c[effectIdx] = undefined;
      }
      // }

      // invoke the effect itself
      var ret = fn();

      // cleanup function returned, to be saved?
      if (typeof ret == 'function') {
        bucket.c[effectIdx] = ret;
      }
    };
    effect[1] = guards;
  }

  bucket.nEI++;
}

export function useMemo<T>(fn: () => T, ...inputGuards: (any | { (): any })[]) {
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

  const bucket = getCurrentBucket();

  // need to create this memoization-slot for this bucket?
  if (!(bucket.nMI in bucket.m)) {
    bucket.m[bucket.nMI] = [];
  }

  const memoization = bucket.m[bucket.nMI];

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

  bucket.nMI++;

  // return the memoized value
  return memoization[0];
}

export function useCallback<T>(fn: T, ...inputGuards: any[]): T {
  return useMemo(function cb() {
    return fn;
  }, ...inputGuards);
}

export function useRef<T>(initialValue: T) {
  // create a new {} object with a `current` property,
  // save it in a state slot
  var [ref] = useState({ current: initialValue });
  return ref;
}

export function isFn(v: unknown) {
  return typeof v == 'function';
}

export function fnWrap(fnOrO: any, args?: any[]) {
  return isFn(fnOrO) ? (fnOrO as Function).apply(null, args) : fnOrO;
}

export function defMapper<P>(state: P, key: keyof P, value: any): P {
  if (state === undefined || value !== state[key]) {
    return { ...state, [key]: value };
  } else {
    return state;
  }
}
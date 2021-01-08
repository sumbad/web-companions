export function isFn(v: unknown) {
  return typeof v == 'function';
}

export function fnWrap(fnOrO: Function | object | undefined, args?: any[]) {
  return isFn(fnOrO) ? (fnOrO as Function).apply(null, args) : fnOrO;
}

export function defRender(c: Element | ShadowRoot | DocumentFragment, t: any) {
  return c instanceof DocumentFragment ? (c.textContent = String(t)) : (c.innerHTML = String(t));
}

export function defMapper<P>(state: P, key: keyof P, value: any): P {
  if (state === undefined || value !== state[key]) {
    return { ...state, [key]: value };
  } else {
    return state;
  }
}
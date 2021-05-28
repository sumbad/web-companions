export function defMapper<P>(state: P, key: keyof P, value: any): P {
  if (state === undefined || value !== state[key]) {
    return { ...state, [key]: value };
  } else {
    return state;
  }
}
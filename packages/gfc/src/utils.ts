export function defMapper<P>(state: P, key: keyof P, value: any): P {
  if (state === undefined || value !== state[key]) {
    return { ...state, [key]: value };
  } else {
    return state;
  }
}

export const prop = {
  req<Type>(attribute?: string) {
    return {
      type: {} as Type,
      attribute,
    };
  },

  opt<Type>(attribute?: string) {
    return {
      type: {} as Type | undefined,
      attribute,
      optional: true,
    };
  },
};

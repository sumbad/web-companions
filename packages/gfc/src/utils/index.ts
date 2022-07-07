export const p = {
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

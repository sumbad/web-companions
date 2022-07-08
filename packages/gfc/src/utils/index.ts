/**
 * The default mapper for Elements
 * 
 * It will update Element's properties inside a Micro Task.
 * So that all new values which were sent at once will be updated together
 *
 * @param this - Element
 * @param key - a property key
 * @param value - a property value
 */
export function setProp<P, Key extends keyof P = keyof P>(
  this: { props: P; isConnected: boolean; },
  key: Key,
  value: P[Key]
) {
  if (!this.isConnected) {
    this.props[key] = value;
    return;
  }

  // Stashed changed properties between updates
  let stash: Partial<P> | null = this['__stash__'];

  if (value !== this.props[key]) {
    stash = {
      ...stash,
      [key]: value,
    };
  }

  Promise.resolve({
    then: () => {
      if (stash != null) {
        this.props = {
          ...this.props,
          ...stash,
        };
      }

      stash = null;
    },
  });
}

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

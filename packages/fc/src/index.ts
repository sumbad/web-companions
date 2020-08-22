import { component, virtual } from 'haunted';
import type { Component } from 'haunted/lib/component';
import type { ElementOptions, VirtualComponentFunc, ElementComponentFunc } from './index.type';


export function defineElement<P extends object>(name: string, func: (host: Component<P>) => unknown | void, options?: ElementOptions<P>) {
  let componentOptions: ElementOptions<P>;
  let _component: Function;

  if (Array.isArray(options?.observedAttributes)) {
    componentOptions = {
      observedAttributes: options?.observedAttributes,
    };
    _component = component<P>(func, componentOptions);
  } else {
    _component = component<P>(func);
  }
  try {
    customElements.define(name, _component as CustomElementConstructor, options);
  } catch (error) {
    console.warn(error);
  }

  return async (properties?: P & Partial<HTMLElement>) => {
    const elClass = await customElements.whenDefined(name).then(() => customElements.get(name));
    // TODO: need check, as I can see it doesn't work
    if (typeof properties === 'object') {
      for (const key in properties) {
        elClass[key] = properties[key];
      }
    }

    return elClass;
  };
}

export function createVirtual<P extends object>(func: VirtualComponentFunc<P>) {
  const result = virtual(func as VirtualComponentFunc<unknown>);
  return result as typeof func;
}

export function FC<P extends object>(func: ElementComponentFunc<P> | VirtualComponentFunc<P>, defaultOptions?: ElementOptions<P>) {
  return {
    element: (name: string, options: ElementOptions<P> | undefined = defaultOptions) => defineElement(name, func, options),
    virtual: () => createVirtual(func as VirtualComponentFunc<P>),
  };
}

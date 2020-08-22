import { component, virtual } from 'haunted';
import type { Component } from 'haunted/lib/component';

type Constructor<P extends object> = new (...args: unknown[]) => Component<P>;
interface Options<P> {
  baseElement?: Constructor<{}>;
  observedAttributes?: (keyof P)[];
  useShadowDOM?: boolean;
  shadowRootInit?: ShadowRootInit;
}

export function defineElement<P extends object>(
  name: string,
  func: (host: Component<P>) => unknown | void,
  options?: ElementDefinitionOptions & Options<P>
) {
  let componentOptions: Options<P>;
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

interface ElementFuncComponent<P extends object> {
  (host: Component<P>): unknown | void;
}

interface VirtualFuncComponent<P> {
  (props?: P): unknown | void;
}

export function createVirtual<P extends object>(func: VirtualFuncComponent<P>) {
  const result = virtual(func as VirtualFuncComponent<unknown>);
  return result as typeof func;
}


export function FC<P extends object>(
  func: ElementFuncComponent<P> | VirtualFuncComponent<P>,
  defaultOptions?: ElementDefinitionOptions & Options<P>
) {
  return {
    element: (name: string, options: (ElementDefinitionOptions & Options<P>) | undefined = defaultOptions) => defineElement(name, func, options),
    virtual: () => createVirtual(func as VirtualFuncComponent<P>),
  };
}

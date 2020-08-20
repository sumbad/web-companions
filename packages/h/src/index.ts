import { component, virtual } from 'haunted';
import type { Component } from 'haunted/lib/component';

type Constructor<P extends object> = new (...args: unknown[]) => Component<P>;
interface Options<P> {
  baseElement?: Constructor<{}>;
  observedAttributes?: (keyof P)[];
  useShadowDOM?: boolean;
  shadowRootInit?: ShadowRootInit;
}

export function FC<P extends object>(
  name: string,
  func: (host: Component<P>) => unknown | void,
  options?: ElementDefinitionOptions & Options<P>
) {
  let componentOptions: Options<P>;
  let _component: Function;
  
  if (Array.isArray(options?.observedAttributes)) {
    componentOptions = { 
      observedAttributes: options?.observedAttributes 
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
    if (typeof properties === 'object') {
      for (const key in properties) {
        elClass[key] = properties[key];
      }
    }
    
    return elClass;
  };
}


interface VirtualFuncComponent<P> {
  (props?: P): unknown | void
}
export function VC<P extends object>(
  func: VirtualFuncComponent<P>
) {
  virtual(func as VirtualFuncComponent<unknown>);

  return func;
}
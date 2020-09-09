import type { Component } from 'haunted/lib/component';

type Constructor<P extends object> = new (...args: unknown[]) => Component<P>;

export interface ElementOptions<P> extends ElementDefinitionOptions {
  baseElement?: Constructor<{}>;
  observedAttributes?: (keyof P)[];
  useShadowDOM?: boolean;
  shadowRootInit?: ShadowRootInit;
  
  
  reflectAttr: Record<string, string>;
}

export interface ComponentFunc<Props extends object> {
  (props: Props): unknown | void;
}

export interface VirtualComponentFunc<P> {
  (props?: P): unknown | void;
}
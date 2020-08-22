import type { Component } from 'haunted/lib/component';

type Constructor<P extends object> = new (...args: unknown[]) => Component<P>;

export interface ElementOptions<P> extends ElementDefinitionOptions {
  baseElement?: Constructor<{}>;
  observedAttributes?: (keyof P)[];
  useShadowDOM?: boolean;
  shadowRootInit?: ShadowRootInit;
}

export interface ElementComponentFunc<P extends object> {
  (host: Component<P>): unknown | void;
}

export interface VirtualComponentFunc<P> {
  (props?: P): unknown | void;
}
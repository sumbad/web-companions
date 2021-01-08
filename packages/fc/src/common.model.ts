interface Type<T> {
  valueOf(): T;
}

export interface TypeConstructor<G> {
  new (value?: any): Type<G>;
  <T>(value?: T): G;
}

export type ConstructorTypes = StringConstructor | BooleanConstructor | NumberConstructor | ArrayConstructor; //| ObjectConstructor;

export type ElementConfigProp<T extends TypeConstructor<PX>, PX> = {
  type: TypeConstructor<PX> extends T ? T : TypeConstructor<PX>;
  default?: PX extends ReturnType<T> ? PX : ReturnType<T>;
  attribute?: string;
};

export type ElementProperties<P> = {
  [x in keyof P]: ElementConfigProp<TypeConstructor<P[x]>, P[x]> | TypeConstructor<P[x]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type Filter<T, U> = T extends U ? T : never;

export type ComponentFunc<P> = (props: P) => unknown | void;
export type ComponentFuncWithoutParams = () => unknown | void;

export type AdapterFunc<P, T> = (elTagName: string, props?: P) => T;

export type EGMapper<P> = (state: P, key: keyof P, value: any, attribute?: string | undefined) => P;
export type EGRender<T> = (container: Element | ShadowRoot | DocumentFragment, template: T) => void;

export interface EGOptions<P, PP, RT> {
  props?: (ElementProperties<P> & PP) | undefined;
  render?: EGRender<RT> | undefined;
  mapper?: EGMapper<P> | undefined;
  shadow?: ShadowRootInit | undefined;
}

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

export type AdapterFunc<P, T> = (elTagName: string, props?: P) => T;

export type ElementMapper<P> = (state: P, key: keyof P, value: any, attribute?: string | undefined) => P;
export type ElementRender<T> = (template: T, container: Element | ShadowRoot | DocumentFragment) => void;

export interface ElementIniConfig<P, PP, RT> {
  render: ElementRender<RT>;
  props?: (ElementProperties<P> & PP) | undefined;
  mapper?: ElementMapper<P> | undefined;
  shadow?: ShadowRootInit | undefined;
}

export type NodeRender<T> = (template: T, ref: { current: object | Node | null }) => any;

export interface NodeIniConfig<T> {
  render: NodeRender<T>;
}

export interface ElementComponent<E, OP> {
  (_p: OP & { ref?: any }): any;
  element: E;
  adapter<T>(func: AdapterFunc<OP, T>, defaultProps?: OP): T;
}

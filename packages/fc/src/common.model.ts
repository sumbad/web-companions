export interface ElementConfig<P> {
  render?: (container: Element | ShadowRoot | DocumentFragment, template: any) => void;
  mapper?: (state: P, key: string, value: any, attribute?: string) => P;
  shadow?: ShadowRootInit;
  elementDefinitionOptions?: ElementDefinitionOptions;
}

export type ElementConfigProp<G> = {
  attribute?: string;
  init?: G;
};

export type ElementProperties<P> = {
  [x in keyof P]: ElementConfigProp<P[x]> | StringConstructor | BooleanConstructor | NumberConstructor | ArrayConstructor;
};

export type defProp1<EP> = {
  [K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : EP[K] extends ElementConfigProp<any> ? EP[K]['init'] : unknown;
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type Filter<T, U> = T extends U ? T : never;

export type defProp<EP> = Optional<
  defProp1<EP>,
  { [K in keyof defProp1<EP>]: Filter<defProp1<EP>[K], undefined> extends never ? never : K }[keyof defProp1<EP>]
>;
export type ComponentFunc<P> = (props: P) => unknown | void;
export type ComponentFuncWithoutParams = () => unknown | void;

export type AdapterFunc<P, T> = (elTagName: string, props?: P) => T;

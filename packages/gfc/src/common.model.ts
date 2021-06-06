export type ElementConfigProp<PX> = {
  type: PX;
  attribute?: string;
  optional?: boolean;
};

export type ElementProperties<P> = {
  [x in keyof P]: ElementConfigProp<P[x]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type Filter<T, U> = T extends U ? T : never;

export type ComponentFunc<P> = (props: P) => Generator<any, void, P>;

export type AdapterFunc<P, T> = (elTagName: string, props?: P) => T;

export type ElementMapper<P> = (state: P, key: keyof P, value: any, attribute?: string | undefined) => P;

export interface ElementIniConfig<P, PP> {
  props?: (ElementProperties<P> & PP) | undefined;
  mapper?: ElementMapper<P> | undefined;
}

export type ElementComponentProps<OP> = OP & {
  ref?: { current: object | Node | null } | any;
  // Global attributes
  accesskey?: string;
  autocapitalize?: string;
  class?: string;
  contenteditable?: boolean;
  contextmenu?: string;
  dir?: string;
  draggable?: boolean;
  dropzone?: string;
  exportparts?: string;
  hidden?: boolean;
  id?: string;
  inputmode?: string;
  is?: string;
  itemid?: string;
  itemprop?: string;
  itemref?: string;
  itemscope?: string;
  itemtype?: string;
  lang?: string;
  part?: string;
  role?: string;
  slot?: string;
  spellcheck?: boolean;
  style?: string;
  tabindex?: number;
  title?: string;
  translate?: string;
} & Partial<Omit<GlobalEventHandlers, 'addEventListener' | 'removeEventListener'>>;

export interface ElementComponent<E, OP> {
  (_p: ElementComponentProps<OP>): any;
  element: E;
  adapter<T>(func: AdapterFunc<OP, T>, defaultProps?: OP): T;
}

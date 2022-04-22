import './jsx';

export type EGProperty<PX> = {
  type: PX;
  attribute?: string;
  optional?: boolean;
};

export type EGProps<P> = {
  [x in keyof P]: EGProperty<P[x]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Filter<T, U> = T extends U ? T : never;

export type ComponentFuncThis<P> = HTMLElement & { next: (props?: P) => void };

export type ComponentFunc<P, This> = (this: This, props: P) => Generator<any, void, P>;

export type AdapterFunc<P, T> = (elTagName: string, props?: P) => T;

export type EGMapper<P> = (state: P, key: keyof P, value: any, attribute?: string | undefined) => P;

export interface EGIniConfig<P, PP> {
  props?: (EGProps<P> & PP) | undefined;
  mapper?: EGMapper<P> | undefined;
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

export interface ElementComponent<E extends CustomElementConstructor, OP, This> {
  new (): InstanceType<E> & {props: ElementComponentProps<OP>} & This;
  (_p: ElementComponentProps<OP>): Promise<E>;
  adapter<T>(func: AdapterFunc<OP, T>, defaultProps?: OP): T;
}

export interface NodeRef<P = unknown, C = Node | null, V = any> {
  current: C;
  generator: Generator<any, void, P | undefined>;
  next: (...args: [] | [P]) => Promise<void>;
  isScheduledNext: boolean;
  props?: P;
  value?: V;
}

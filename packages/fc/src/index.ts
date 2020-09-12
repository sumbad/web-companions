// import { component, virtual } from 'haunted';
// import type { Component } from 'haunted/lib/component';
// import type { ElementOptions } from './index.type';

import { augmentor, useRef } from 'dom-augmentor';
// import { augmentor } from 'augmentor';
import { html, render, Renderable } from 'uhtml';

function renderFunc(container: Element | ShadowRoot | DocumentFragment, template: Renderable) {
  render(container, template);
}

// type ElementConfigProp<G> = {
//   attribute?: string;
//   reflect?: boolean;
//   init?: G;
// };

interface ElementConfig<P> {
  // props: {
  //   [x in keyof P]: ElementConfigProp<P[x]> | null;
  // };
  mapper?: (state: P, key: string, value: any) => {} | void;
  shadow?: ShadowRootInit;
  elementDefinitionOptions?: ElementDefinitionOptions;
}

// type ElementProperties<P> = {
//     [x in keyof P]: ElementConfigProp<P[x]> | null;
// };

// export interface ComponentFunc<P> {
//   (props: P): unknown | void;
// }

function reflectAttrFromProp(el: Element, attrName: string, value: any) {
  if (el instanceof Element) {
    switch (typeof value) {
      case 'boolean':
        if (value) {
          el.setAttribute(attrName, '');
        } else {
          el.removeAttribute(attrName);
        }
        break;
      default:
        el.setAttribute(attrName, String(value));
        break;
    }
  }
}

export function defineElement<P, EP>(name: string, func: ComponentFunc<P>, elProps?: EP, config?: ElementConfig<P>) {
  let _mapper = function <T extends keyof P>(props: P, key: T | any, value: any): P {
    if (props === undefined || value !== props[key]) {
      return { ...props, [key]: value };
    } else {
      return props;
    }
  };

  // if(elProps !== undefined) {
  //   const propsEntriesMap1 = Object.entries<ElementConfigProp<P>>(elProps);
  // }

  const propsEntriesMap = elProps === undefined ? [] : Object.entries<ElementConfigProp<P>>(elProps as any);

  const elementClass = class extends HTMLElement {
    static attributes: { [x: string]: string } = {};
    static get observedAttributes() {
      return Object.values(this.attributes);
    }

    public connected: boolean = false;
    public _props: Partial<P> = {};

    public set props(newProps) {
      if (newProps !== undefined && this.props !== newProps) {
        this._props = newProps;
        this.forceUpdate();
      }
    }
    public get props() {
      return this._props as P;
    }

    /**
     * Render function
     */
    render: (props: P) => unknown | void;
    /**
     * Attach the current template to DOM
     */
    // private _attach: () => void;

    // prettier-ignore
    constructor() {
        super();
    
        // const attach = (container: Element | ShadowRoot | DocumentFragment) => {
        //   if (this.connected) {         
        //     console.log(44444);
        //     this.render(this.props);
        //   }
        // };
    
        const container = config?.shadow !== undefined ? this.attachShadow(config.shadow) : this;

        func = new Proxy(func, {
          apply: (target, thisArg, args) => {
            const temp = Reflect.apply(target, this, args);
            // console.log(333333, temp, this.connected, target, thisArg, args);
            if (this.connected) {
              renderFunc(container, temp);
            }
            return temp;
          }
        });

        // this._attach = attach.bind(null, container);

        this.render = augmentor(func);
        
        for (const [pKey, pValue] of propsEntriesMap) {
          const reflectAttr = pValue?.reflect ? pValue.attribute ?? pKey : undefined;
          // makePropertyMapper(this, arg, _mapper, reflectAttr);
          Reflect.defineProperty(this, pKey, {
            get: () => {
              return this.props[pKey];
            },
            set: (value: keyof P) => {
              this.props = _mapper(this.props, pKey, value);
              if (reflectAttr !== undefined) {
                reflectAttrFromProp(this, reflectAttr, this.props[pKey]);
              }
            },
            enumerable: true,
          });

          if (pValue?.init !== undefined) {
            this.props[pKey] = pValue.init;
          }
        }
    }

    /**
     * LIFECYCLE
     * Invoked when the custom element is first connected to the document's DOM.
     */
    connectedCallback(): void {
      this.connected = true;
      this.render(this.props);
    }

    /**
     * LIFECYCLE
     * Invoked when one of the custom element's attributes is added, removed, or changed.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      console.log(6666, name, oldValue, newValue);

      if (oldValue !== newValue) {
        for (const [attrKey, attrName] of Object.entries(this.constructor['attributes'])) {
          if (attrName === name && this[attrKey] !== newValue) {
            this[attrKey] = newValue;
            break;
          }
        }
      }
    }

    /**
     * Force update current view
     */
    forceUpdate() {
      this.render(this.props);
    }
  };

  const attrKey = 'attributes';
  const attributes = Reflect.get(elementClass, attrKey);
  propsEntriesMap
    .filter((e) => e[1]?.attribute)
    .forEach(([pKey, pValue]) => {
      Reflect.defineProperty(elementClass, attrKey, {
        value: {
          ...attributes,
          [pKey]: pValue?.attribute,
        },
        enumerable: true,
        writable: true,
      });
    });

  try {
    customElements.define(name, elementClass, config?.elementDefinitionOptions);
  } catch (error) {
    console.warn(error);
  }
}

export function createElement<P, EP>(name: string, func: ComponentFunc<P>, elProps?: EP, config?: ElementConfig<any>) {
  defineElement(name, func, elProps, config);

  const createInstance = async (properties?: P & Partial<HTMLElement> & { ref: {} }) => {
    const elClass = await customElements.whenDefined(name).then(() => customElements.get(name));
    // TODO: need check, as I can see it doesn't work
    if (typeof properties === 'object') {
      for (const key in properties) {
        elClass[key] = properties[key];
      }
    }

    return elClass;
  };

  createInstance.adapter = <T>(func: (elTagName: string, props?: P) => T, defaultProps?: P) => func(name, defaultProps);

  return createInstance;
}

const foo = <T extends string | number>(first: T, ...prop: T extends string ? [T] : []) => undefined;

foo('1', '1');
foo(1);

type m<A> = { m: A };

export type ElementConfigProp<G> = {
  attribute?: string;
  reflect?: boolean;
  init?: G;
};

export type ElementProperties<P> = {
  // [x in keyof P]: (P[x] extends StringConstructor | BooleanConstructor | NumberConstructor | ArrayConstructor ? m<ReturnType<P[x]>> : ElementConfigProp<P[x]>);
  // [x in keyof P]: (P[x] extends StringConstructor | BooleanConstructor | NumberConstructor | ArrayConstructor ? ReturnType<P[x]> : ElementConfigProp<P[x]>);
  [x in keyof P]: ElementConfigProp<P[x]> | StringConstructor | BooleanConstructor | NumberConstructor | ArrayConstructor;
};

type a = ReturnType<typeof String>;

type Diff<T, U> = T extends U ? never : T;

export type defProp1<EP> = {
  [K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : EP[K] extends ElementConfigProp<any> ? EP[K]['init'] : unknown;
};
// export type defProp<EP> = Partial<{[K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : EP[K] extends ElementConfigProp<any> ? EP[K]['init'] : unknown;}>;
// export type defProp1<EP> = {[K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : EP[K] extends ElementConfigProp<any> ? (EP[K]['init'] extends undefined ? unknown : EP[K]['init']) : unknown;};
// export type defProp2<EP> = {[K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : EP[K] extends ElementConfigProp<any> ? (EP[K]['init'] extends undefined ? EP[K]['init'] : unknown) : unknown;};
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
type RequireOnlyOne<T> = Pick<T, Exclude<keyof T, keyof { [L in keyof T]: T[L] extends object ? T[L] : never }>>;
// & {
//     [K in Keys]-?:
//         Required<Pick<T, K>>
//         & Partial<Record<Exclude<Keys, K>, undefined>>
// }[Keys]
// export type defProp<EP> = AtLeastOne<defProp1<EP>, {[K in keyof defProp1<EP>]: defProp1<EP>[K] extends undefined ? defProp1<EP>[K]: never}>;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
// export type defProp<EP> = Optional<defProp1<EP>, ({[I in keyof EP]: EP[I] extends ElementConfigProp<unknown | undefined> ? I : never})[keyof EP]>;//RequireOnlyOne<defProp1<EP>>;
type Filter<T, U> = T extends U ? T : never;
export type defProp<EP> = Optional<
  defProp1<EP>,
  { [K in keyof defProp1<EP>]: Filter<defProp1<EP>[K], undefined> extends never ? never : K }[keyof defProp1<EP>]
>; //RequireOnlyOne<defProp1<EP>>;
// ({[I in keyof defProp1<EP>]: defProp1<EP>[I] extends (defProp1<EP>[I] & undefined) ? I : never})[keyof EP]
// type ComponentFunc<P, EP> = (props: P & {[K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : never;}) => unknown | void;
export type ComponentFunc<P> = (props: P) => unknown | void;
export type ComponentFuncWithoutParams = () => unknown | void;

// type ttt = ComponentFunc<{a: }, {a: StringConstructor}>

// export function FC<P extends {}>(func: ComponentFunc<P>, elProps: ElementProperties<P>, defaultElementConfig?: ElementConfig<P>): any

// export function FC<P>(func: ComponentFunc<P>, config: ElementConfig<P>) {
//   return {
//     // element: (name: string, config: ElementConfig<P>) => createElement(name, func, elProps as any, config),
//     // virtual: () => augmentor(func),
//   };
// }

// export function defineElement1(func: () => unknown | void): any;
// export function defineElement1<P>(...prop:  P extends object ? [ElementProperties<P>, (props: P) => unknown | void] : [(props: P) => unknown | void]) {}
// export function defineElement1<P>(props: ElementProperties<P> | ComponentFunc<ElementProperties<P>>, ...args:  P extends object ? [ComponentFunc<ElementProperties<P>>, ElementConfig<P>?] : [ElementConfig<P>?]) {}
// export function defineElement1<P, PP extends ElementProperties<P> | ComponentFunc<unknown>>(props: PP, ...args: PP extends ComponentFunc<unknown> ? [ElementConfig<P>?] : [ComponentFunc<PP>, ElementConfig<P>?]) {}
export function defineElement1<
  P,
  PP extends ElementProperties<P> | ComponentFuncWithoutParams = ElementProperties<P> | ComponentFuncWithoutParams
>(
  props: PP,
  ...args: PP extends ComponentFuncWithoutParams
    ? [ElementConfig<P>?]
    : [ComponentFunc<P extends object ? P : defProp<PP>>, ElementConfig<P>?]
) {}

// type mff = Filter<string | undefined | null, undefined | string>;
// type mff<EP> = ({[K in keyof EP]: Filter<EP[K], undefined> extends never ? never : K})[keyof EP];

// const fff: mff<{b: string; a: number | undefined }>;
// fff.

// type mf = defProp<{b: { init: string | undefined }}>;

// type aa = mf;
// const bbb: aa;
// bbb

defineElement1(
  {
    a: String,
    b: {
      init: '' as string | undefined,
    },
  },
  function aaa(props) {
    console.log(props);
  }
);

defineElement1<{ b?: string }>(
  // defineElement1(
  {
    b: { init: '1' },
  },
  function aaa(props) {
    console.log(props.b);
  }
);

defineElement1(function () {
  console.log();
});

defineElement1(() => {
  console.log();
});

export function FC<P, PP extends ElementProperties<P> | ComponentFuncWithoutParams = ElementProperties<P> | ComponentFuncWithoutParams>(
  props: PP,
  ...args: PP extends ComponentFuncWithoutParams
    ? [ElementConfig<P>?]
    : [ComponentFunc<P extends object ? P : defProp<PP>>, ElementConfig<P>?]
) {
  let func: any; //ComponentFunc<unknown | P extends object ? P : defProp<PP>>;
  let elProps: PP;
  const defaultElementConfig = args[1];

  // TODO: remove types casting
  if (typeof props === 'function') {
    func = props as ComponentFunc<unknown>;
  } else if (typeof args[0] === 'function') {
    elProps = props;
    func = args[0];
  }




  return {
    element: (name: string, config: ElementConfig<P> | undefined = defaultElementConfig) =>
      createElement<P, PP>(name, func, elProps, config),

    virtual: () => {
      const nodeFuncMap = new WeakMap();
      let count = 0;
      const $html = (props: any) => {
        const currentNode = useRef(null);
        let currentFunc = nodeFuncMap.get(currentNode);
        if(currentFunc !== undefined) {
          
        } else {
          currentFunc = augmentor(func);
          nodeFuncMap.set(currentNode, currentFunc);
        }
        
        // console.log(nodes, nodes.has(useRef(null)));

        // const m = useRef(null);
        // count = count + 1;
        // aaa.set(m, count);
        // console.log('args ', args);
        
        return html.for(currentNode)`${currentFunc(props)}`//.apply(null, [aFunc(props)]);
      };

      // const host = html.node`<div />`;
      // console.log('11111111 virtual', host.firstChild);
      return function (props: P) {

        return $html(props); //`${aFunc(props)}`;
      };
    },
  };
}

// --------------------------------------------------------------- (3)

// console.log(host, props.id, host.firstChild);

// let element = host.querySelector('#virtual-' + props.id);
// let aFunc;

// console.log(props.id, element, host.firstChild);
// if (element === null || element['aFunc'] === undefined) {
//   element = document.createElement('div');
//   element.setAttribute('id', 'virtual-' + props.id);
//   host.appendChild(element);

// const _func = func.bind(element);
// const pFunc = new Proxy(_func, {
//   apply: (target, thisArg, args) => {
//     // console.log(999, target, thisArg, args);
//     const temp = Reflect.apply(target, thisArg, args);
//     render(element as Element, temp);
//     return temp;
//   },
// });
// aFunc = augmentor(func);
//   element['aFunc'] = aFunc;
// } else {
//   aFunc = element['aFunc'];
// }

// console.log(host.querySelector('#virtual-a'), host.querySelector('#virtual-b'));

// aFunc(props);

//----------------------------------------------(2)

// virtual: (host: Node = document.createElement('div')) => {
//   const _func = func.bind(host);

//   const pFunc = new Proxy(_func, {
//     apply: (target, thisArg, args) => {
//       // console.log(999, target, thisArg, args);
//       const temp = Reflect.apply(target, thisArg, args);
//       render(host, temp);
//       // render(host, html.for(host, props.id)`${temp}`);
//       return temp;
//     },
//   });
//   const aFunc = augmentor(pFunc);

//   return function (props: P) {
//     aFunc(props);
//     return host;
//   };
// },

//----------------------------------------------(1)

// virtual: () => {
//   let hosts = new WeakMap();

//   return function (props: P & { host: Node }) {
//     console.log(4444, hosts, hosts.has(props.host));
//     console.log(2222, props);

//     if (hosts.has(props.host)) {
//       const host = hosts.get(props.host);
//       host.func(props);
//       return host.host;
//     } else {
//       // const host = document.createElement('div');
//       // console.log('virt-host', host);
//       const host = props.host;
//       const _func = func.bind(host);

//       const pFunc = new Proxy(_func, {
//         apply: (target, thisArg, args) => {
//           // console.log(999, target, thisArg, args);
//           const temp = Reflect.apply(target, thisArg, args);
//           render(host, temp);
//           // render(host, html.for(host, props.id)`${temp}`);
//           return temp;
//         },
//       });
//       const aFunc = augmentor(pFunc);
//       hosts.set(host, { func: aFunc, host });

//       aFunc(props);
//       return host;
//     }
//   };
// },

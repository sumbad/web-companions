// import { component, virtual } from 'haunted';
// import type { Component } from 'haunted/lib/component';
// import type { ElementOptions } from './index.type';

import { augmentor } from 'augmentor';
import { render, Renderable } from 'uhtml';

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


export function defineElement<P, EP>(name: string, func: ComponentFunc<EP>, elProps?: EP, config?: ElementConfig<P>) {
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
            console.log(333333, this.connected, target, thisArg, args);
            const temp = Reflect.apply(target, this, args);
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


export function createElement<P, EP>(name: string, func: ComponentFunc<EP>, elProps?: EP, config?: ElementConfig<P>) {
  defineElement(name, func, elProps, config);

  const createInstance = async (properties?: defProp<EP> & Partial<HTMLElement> & {ref: {}}) => {
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
  

const foo = <T extends string | number>(
  first: T, 
  ...prop: (T extends string ? [T] : [])
) => undefined;

foo('1', '1');
foo(1);

type m<A> = {m: A};


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

export type defProp<EP> = {[K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : EP[K] extends ElementConfigProp<any> ? EP[K]['init'] : unknown;};
// type ComponentFunc<P, EP> = (props: P & {[K in keyof EP]: EP[K] extends StringConstructor ? ReturnType<EP[K]> : never;}) => unknown | void;
export type ComponentFunc<EP> = (props: defProp<EP>) => unknown | void;


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
export function defineElement1<P, PP extends ElementProperties<P> | ComponentFunc<unknown>>(props: PP, ...args: PP extends ComponentFunc<unknown> ? [ElementConfig<P>?] : [ComponentFunc<PP>, ElementConfig<P>?]) {}


defineElement1(
  {
    a: String,
    b: {init: '1'}
  },
  function aaa (props) {
    console.log(props.a);
  }
)

defineElement1(
  {
    b: {init: '1'}
  },
  function aaa (props) {
    console.log(props.b);
  }
)


// defineElement1(
//   (p: {a: string}) => {
// });

// defineElement1(
//   (p: {a: string}) => {
//     // console.log(props.b);
//   }
// )


const aa = String();


export function FC<P, PP extends ElementProperties<P> | ComponentFunc<unknown>>(props: PP, ...args: PP extends ComponentFunc<unknown> ? [ElementConfig<P>?] : [ComponentFunc<PP>, ElementConfig<P>?]) {
  let func: ComponentFunc<unknown | PP>;
  let elProps: PP;
  const defaultElementConfig = args[1];
  
  // TODO: remove types casting
  if(typeof props === 'function') {
    func = props as ComponentFunc<unknown>;
  } else if (typeof args[0] === 'function') {
    elProps = props;
    func = args[0] as ComponentFunc<unknown>;
  }
  return {
    element: (name: string, config: ElementConfig<P> | undefined = defaultElementConfig) => createElement(name, func, elProps, config),
    virtual: () => augmentor(func),
  };
}

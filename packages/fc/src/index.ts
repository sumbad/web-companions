import { augmentor, useRef } from 'augmentor';
import { html, render, Renderable } from 'uhtml';


export interface ElementConfig<P> {
  mapper?: (state: P, key: string, value: any) => {} | void;
  shadow?: ShadowRootInit;
  elementDefinitionOptions?: ElementDefinitionOptions;
}

export type ElementConfigProp<G> = {
  attribute?: string;
  reflect?: boolean;
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





function renderFunc(container: Element | ShadowRoot | DocumentFragment, template: Renderable) {
  render(container, template);
}

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

      const vRender = (props: any) => {
        const currentNode = useRef(null);
        let currentFunc = nodeFuncMap.get(currentNode);
        if (currentFunc !== undefined) {
        } else {


          const pFunc = new Proxy(func, {
            apply: (target, thisArg, args) => {
              const temp = Reflect.apply(target, thisArg, args);
              return html.for(currentNode)`${temp}`;
            },
          });

          currentFunc = augmentor(pFunc);
          nodeFuncMap.set(currentNode, currentFunc);
        }

        return currentFunc(props);
      };

      return function (props: P) {
        return vRender(props);
      };
    },
  };
}

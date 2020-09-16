import { augmentor } from 'augmentor';
import type {
  ComponentFunc,
  ElementConfig,
  ElementConfigProp,
  ElementProperties,
  ComponentFuncWithoutParams,
  defProp,
} from './common.model';
// import { render } from 'uhtml';
import { reflectAttrFromProp } from './utils';

function createElement<P, EP>(func: ComponentFunc<P>, elProps?: EP, config?: ElementConfig<P>) {
  let _mapper = function <T extends keyof P>(props: P, key: T | any, value: any): P {
    if (props === undefined || value !== props[key]) {
      return { ...props, [key]: value };
    } else {
      return props;
    }
  };
  // const renderFunc = (container: Element | ShadowRoot | DocumentFragment, template: any) => {
  //   render(container, template);
  // };
  
  const renderFunc = config?.render || ((c, t) => c instanceof DocumentFragment ? c.textContent = t : c.innerHTML = t)

  const propsEntriesMap = elProps === undefined ? [] : Object.entries<ElementConfigProp<P>>(elProps as any);

  const elClass = class extends HTMLElement {
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
          apply: (target, tA, args) => {
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
  const attributes = Reflect.get(elClass, attrKey);
  propsEntriesMap
    .filter((e) => e[1]?.attribute)
    .forEach(([pKey, pValue]) => {
      Reflect.defineProperty(elClass, attrKey, {
        value: {
          ...attributes,
          [pKey]: pValue?.attribute,
        },
        enumerable: true,
        writable: true,
      });
    });

  return elClass;

  // try {
  //   customElements.define(name, elementClass, config?.elementDefinitionOptions);
  // } catch (error) {
  //   console.warn(error);
  // }
}

export function EFC<P, PP extends ElementProperties<P> | ComponentFuncWithoutParams = ElementProperties<P> | ComponentFuncWithoutParams>(
  props: PP,
  ...args: PP extends ComponentFuncWithoutParams
    ? [ElementConfig<P>?]
    : [ComponentFunc<P extends object ? P : defProp<PP>>, ElementConfig<P>?]
) {
  let func: any; //ComponentFunc<unknown | P extends object ? P : defProp<PP>>;
  let elProps: PP | undefined;
  let conf: ElementConfig<P> | undefined;
  // const defaultElementConfig = args[1];

  // TODO: remove types casting
  if (typeof props === 'function') {
    func = props as ComponentFunc<unknown>;
    conf = args[0] as ElementConfig<P> | undefined;
  } else if (typeof args[0] === 'function') {
    elProps = props;
    func = args[0];
    conf = args[1];
  }
  
  console.log(111, conf);
  

  const element = createElement<P, PP>(func, elProps, conf);

  return {
    element,
    define: (name: string, options: ElementDefinitionOptions | undefined = conf?.elementDefinitionOptions) => {
      try {
        customElements.define(name, element, options);
      } catch (error) {
        console.warn(error);
      }
      return async (p: P) => {
        return customElements.whenDefined(name).then(() => customElements.get(name));
      };
    },
    adapter: <T>(func: (elTagName: string, props?: P) => T, defaultProps?: P) => func(name, defaultProps),
  };
}

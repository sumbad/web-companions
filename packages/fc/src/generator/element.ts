import { AF } from '../hooks';

import type {
  ComponentFunc,
  ElementConfig,
  ElementConfigProp,
  ElementProperties,
  ComponentFuncWithoutParams,
  defProp,
  AdapterFunc,
} from '../common.model';
import { isFn } from '../utils';

function makeEl<P, EP>(func: ComponentFunc<P>, elProps?: EP, config?: ElementConfig<P>) {
  let mapper =
    config?.mapper ||
    function <T extends keyof P>(props: P, key: T | any, value: any): P {
      if (props === undefined || value !== props[key]) {
        return { ...props, [key]: value };
      } else {
        return props;
      }
    };

  const renderFunc = config?.render || ((c, t) => (c instanceof DocumentFragment ? (c.textContent = t) : (c.innerHTML = t)));

  const propEntMap = elProps === undefined ? [] : Object.entries<ElementConfigProp<P>>(elProps as any);

  const elClass = class extends HTMLElement {
    // TODO: change to Symbol
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
    render: ComponentFunc<P>;

    constructor() {
      super();

      const container = config?.shadow !== undefined ? this.attachShadow(config.shadow) : this;

      this.render = () => {
        const tpl = Reflect.apply(aFunc, this, [this.props]);

        if (this.connected) {
          renderFunc(container, tpl);
        }
      };

      const aFunc = AF(func, this.render);

      for (const [pKey, pValue] of propEntMap) {
        Reflect.defineProperty(this, pKey, {
          get: () => {
            return this.props[pKey];
          },
          set: (value: keyof P) => {
            this.props = mapper.apply(this, [this.props, pKey, value, pValue.attribute]);
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
  propEntMap
    .filter((e) => e[1]?.attribute)
    .forEach(([pK, pV]) => {
      Reflect.defineProperty(elClass, attrKey, {
        value: {
          ...attributes,
          [pK]: pV?.attribute,
        },
        enumerable: true,
        writable: true,
      });
    });

  return elClass;
}

export function EG<P, PP extends ElementProperties<P> | ComponentFuncWithoutParams = ElementProperties<P> | ComponentFuncWithoutParams>(
  props: PP,
  ...args: PP extends ComponentFuncWithoutParams
    ? [ElementConfig<P>?]
    : [ComponentFunc<P extends object ? P : defProp<PP>>, ElementConfig<P>?]
) {
  let func: any; //ComponentFunc<unknown | P extends object ? P : defProp<PP>>;
  let elProps: PP | undefined;
  let conf: ElementConfig<P> | undefined;

  // TODO: remove types casting
  if (isFn(props)) {
    func = props as ComponentFunc<unknown>;
    conf = args[0] as ElementConfig<P> | undefined;
  } else if (isFn(args[0])) {
    elProps = props;
    func = args[0];
    conf = args[1];
  }

  const element = makeEl<P, PP>(func, elProps, conf);

  const define = (name: string, options: ElementDefinitionOptions | undefined = conf?.elementDefinitionOptions) => {
    try {
      customElements.define(name, element, options);
    } catch (e) {
      console.warn(e);
    }
    return async (p: (P extends object ? P : defProp<PP>) | { ref: any }) => {
      return customElements.whenDefined(name).then(() => customElements.get(name));
    };
  };

  const adapter = <T>(func: AdapterFunc<P, T>, name: string, defaultProps?: P) => {
    try {
      customElements.define(name, element);
    } catch (e) {}
    return func(name, defaultProps);
  };

  return {
    element,
    define,
    adapter,
  };
}

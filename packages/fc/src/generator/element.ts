import { AF } from '../hooks';

import type { ComponentFunc, ElementProperties, AdapterFunc, Optional, EGMapper, EGRender, EGOptions } from '../common.model';
import { defRender, defMapper } from '../utils';

/**
 * Element Generator
 * @param options
 */
export function EG<P, PP extends ElementProperties<P>, RT>(options: EGOptions<P, PP, RT> = {}) {
  const render = options.render || defRender;
  const mapper = options.mapper || defMapper;

  return (func: ComponentFunc<P>) => {
    const element = build(func, options.props || {}, render, mapper, options.shadow);

    return {
      element,
      define: (name: string, options?: ElementDefinitionOptions) => {
        try {
          customElements.define(name, element, options);
        } catch (e) {
          console.warn(e);
        }

        type OP = Optional<P, { [k in keyof PP]: PP[k] extends { default: any } ? k : never }[keyof P]>;

        return async (_p: OP & { ref?: any }) => {
          return customElements.whenDefined(name).then(() => customElements.get(name));
        };
      },
      adapter: <T>(func: AdapterFunc<P, T>, name: string, defaultProps?: P) => {
        try {
          customElements.define(name, element);
        } catch (e) {}
        return func(name, defaultProps);
      },
    };
  };
}

/**
 *  Build a new element class
 * @param func
 * @param props
 * @param render
 * @param mapper
 * @param shadow
 */
function build<P, RT>(
  func: ComponentFunc<P>,
  props: ElementProperties<any>,
  render: EGRender<RT>,
  mapper: EGMapper<P>,
  shadow?: ShadowRootInit | undefined
) {
  const elClass = class extends HTMLElement {
    // TODO: change to Symbol
    static attributes: { [x: string]: string } = {};
    static get observedAttributes() {
      return Object.values(this.attributes);
    }

    _props: Partial<P> = {};
    public set props(newProps) {
      if (newProps !== undefined && this.props !== newProps) {
        this._props = newProps;
        this.render();
      }
    }
    public get props() {
      return this._props as P;
    }

    constructor() {
      super();

      const ctr = shadow !== undefined ? this.attachShadow(shadow) : this;

      this.render = () => {
        const tpl = Reflect.apply(aFunc, this, [this.props]);
        render(ctr, tpl);
      };

      const aFunc = AF(func, this.render);

      for (const pK in props) {
        const pV = props[pK];
        let attr: string | undefined = undefined;

        if ('type' in pV) {
          this.props[pK] = pV.default;
          attr = pV.attribute;
        }

        Reflect.defineProperty(this, pK, {
          get: () => {
            return this.props[pK];
          },
          set: (value: keyof P) => {
            this.props = mapper.apply(this, [this.props, pK as keyof P, value, attr]);
          },
          enumerable: true,
        });
      }

      Object.keys(props).forEach((pKey) => {});
    }

    /**
     * LIFECYCLE
     * Invoked when the custom element is first connected to the document's DOM.
     */
    connectedCallback(): void {
      this.render();
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
     * Render function
     */
    render: () => void;
  };

  // TODO: change to Symbol
  const attrKey = 'attributes';
  const attributes = Reflect.get(elClass, attrKey);

  for (const pK in props) {
    const pV = props[pK];
    if ('type' in pV && pV.attribute !== undefined) {
      Reflect.defineProperty(elClass, attrKey, {
        value: {
          ...attributes,
          [pK]: pV.attribute,
        },
        enumerable: true,
        writable: true,
      });
    }
  }

  return elClass;
}

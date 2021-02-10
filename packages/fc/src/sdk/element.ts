import { AF } from '../hooks';

import type {
  ComponentFunc,
  ElementProperties,
  AdapterFunc,
  Optional,
  ElementMapper,
  ElementRender,
  ElementIniConfig,
  ElementComponent,
} from '../common.model';
import { defMapper } from '../utils';

/**
 * Initialize Element Generator
 */
export function EG<P, PP extends ElementProperties<P> = ElementProperties<P>, RT = any>(config: ElementIniConfig<P, PP, RT>) {
  const mapper = config.mapper || defMapper;

  type OP = Optional<P, { [k in keyof PP]: PP[k] extends { default: any } ? k : never }[keyof P]>;

  return (func: ComponentFunc<P>) => {
    const element = build(func, config.props || {}, config.render, mapper, config.shadow);

    return (name: string, options?: ElementDefinitionOptions): ElementComponent<typeof element, OP> => {
      try {
        customElements.define(name, element, options);
      } catch (e) {
        console.warn(e);
      }

      const component = (async (_p: OP & { ref?: any }) => {
        return customElements.whenDefined(name).then(() => customElements.get(name));
      }) as ElementComponent<typeof element, OP>;

      component.element = element;
      component.adapter = <T>(func: AdapterFunc<OP, T>, defaultProps?: OP) => func(name, defaultProps);

      return component;
    };
  };
}

/**
 *  Build a new custom element class
 * @param func
 * @param props
 * @param render
 * @param mapper
 * @param shadow
 */
function build<P, RT>(
  func: ComponentFunc<P>,
  props: ElementProperties<any>,
  render: ElementRender<RT>,
  mapper: ElementMapper<P>,
  shadow?: ShadowRootInit | undefined
) {
  const customEl = class extends HTMLElement {
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

    aFunc: ComponentFunc<P>;

    constructor() {
      super();

      const ctr = shadow !== undefined ? this.attachShadow(shadow) : this;

      this.aFunc = AF(func, (r: any) => render(r, ctr));

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
    render() {
      this.isConnected && Reflect.apply(this.aFunc, this, [this.props]);
    }
  };

  // TODO: change to Symbol
  const attrKey = 'attributes';
  const attributes = Reflect.get(customEl, attrKey);

  for (const pK in props) {
    const pV = props[pK];
    if ('type' in pV && pV.attribute !== undefined) {
      Reflect.defineProperty(customEl, attrKey, {
        value: {
          ...attributes,
          [pK]: pV.attribute,
        },
        enumerable: true,
        writable: true,
      });
    }
  }

  return customEl;
}

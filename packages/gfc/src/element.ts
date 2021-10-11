import type {
  ComponentFunc,
  ElementProperties,
  AdapterFunc,
  Optional,
  ElementMapper,
  ElementIniConfig,
  ElementComponent,
  ElementComponentProps,
} from './@types';
import { defMapper } from './utils';

const nodes: unknown[] = [];
let nodeIdx = -1;
let isConnecting = true;

/**
 * Initialize Element Generator
 */
export function EG<P, PP extends ElementProperties<P> = ElementProperties<P>>(config?: ElementIniConfig<P, PP>) {
  const mapper = config?.mapper || defMapper;

  type OP = Optional<P, { [k in keyof PP]: PP[k] extends { optional: boolean } ? k : never }[keyof P]>;

  return (func: ComponentFunc<P>) => {
    const element = build(func, config?.props || {}, mapper);

    return (name: string, options?: ElementDefinitionOptions): ElementComponent<typeof element, OP> => {
      try {
        customElements.define(name, element, options);
      } catch (e) {
        console.warn(e);
      }

      const component = async (_p: ElementComponentProps<OP>) => {
        return customElements.whenDefined(name).then(() => customElements.get(name));
      };

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
 * @param mapper
 * @param shadow
 */
function build<P>(func: ComponentFunc<P>, props: ElementProperties<unknown>, mapper: ElementMapper<P>) {
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
        this.next();
      }
    }
    public get props() {
      return this._props as P;
    }

    isScheduledNext = false;
    generation: Generator<any, void, P> | undefined;

    async next() {
      if (!this.isScheduledNext && this.generation != null) {
        this.isScheduledNext = true;

        const generator = await Promise.resolve(this.generation);
        this.isScheduledNext = false;
        generator.next(this.props);
      }
    }

    constructor() {
      super();

      for (const pK in props) {
        const pV = props[pK];
        let attr: string | undefined = undefined;

        if ('type' in pV) {
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
      this.generation = func.apply(this, [this.props]);

      isConnecting = true;
      this.generation!.next(this.props);
      isConnecting = false;
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
     * LIFECYCLE
     * Invoked each time the custom element is disconnected from the document's DOM
     */
    disconnectedCallback() {
      nodes.length = 0;
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

/**
 * Set, check and return an Node ID in this Element
 *
 * @param id - a Node ID
 * @returns
 */
export function setElNode<Val extends object>(id: Val): Val {
  if (isConnecting) {
    nodes.push(id);
    return id;
  } else {
    nodeIdx++;
    nodeIdx = nodeIdx >= nodes.length ? 0 : nodeIdx;
    return nodes[nodeIdx] as Val;
  }
}

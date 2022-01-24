import type {
  ComponentFunc,
  EGProps,
  AdapterFunc,
  Optional,
  EGMapper,
  EGIniConfig,
  ElementComponentProps,
  ComponentFuncThis,
  ElementComponent,
} from './@types';
import { defMapper } from './utils';

// Element's nodes
const nodes: object[] = [];
let nodeIdx = -1;
let isConnected = false;


/**
 * Initialize Element Generator
 * 
 * @param config - configuration
 * @returns - a new Element Generator
 */
export function EG<P, PP extends EGProps<P> = EGProps<P>>(config?: EGIniConfig<P, PP>) {
  const mapper = config?.mapper || defMapper;

  type OP = Optional<P, { [k in keyof PP]: PP[k] extends { optional: boolean } ? k : never }[keyof P]>;

  // Create Element Component based on a generator function - func
  return <This extends ComponentFuncThis<P> = ComponentFuncThis<P>>(func: ComponentFunc<P, This>) => {
    const constructor = construct(func as ComponentFunc<P, ComponentFuncThis<P>>, config?.props || {}, mapper);

    // Return Element Component
    return (name: string, options?: ElementDefinitionOptions) => {
      try {
        customElements.define(name, constructor, options);
      } catch (e) {
        console.warn(e);
      }

      const component = function (_props: ElementComponentProps<OP>) {
        if (new.target != null) {
          return new constructor();
        } else {
          return customElements.whenDefined(name).then(() => customElements.get(name));
        }
      } as ElementComponent<typeof constructor, OP>;

      component.adapter = <T>(func: AdapterFunc<OP, T>, defaultProps?: OP) => func(name, defaultProps);

      return component;
    };
  };
}

/**
 * Build a new custom element class
 *
 * @param func
 * @param props
 * @param mapper
 */
function construct<P>(func: ComponentFunc<P, ComponentFuncThis<P>>, props: EGProps<unknown>, mapper: EGMapper<P>): CustomElementConstructor {
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

    async next(props = this.props) {
      if (!this.isScheduledNext && this.generation != null) {
        this.isScheduledNext = true;

        const generator = await Promise.resolve(this.generation);
        this.isScheduledNext = false;
        this.props = props;
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

      isConnected = false;
      this.generation!.next(this.props);
      isConnected = true;
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
      this.generation?.return();
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
export function setElNode(id: object): object {
  if (isConnected && nodes.length > 0) {
    nodeIdx++;
    nodeIdx = nodeIdx >= nodes.length ? 0 : nodeIdx;

    return nodes[nodeIdx];
  } else {
    nodes.push(id);

    return id;
  }
}

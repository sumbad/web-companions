import { setProp } from './utils';
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
  ElementWithNodes,
  ElementNodeItem,
} from './@types';


let actualEl: ElementWithNodes | undefined = undefined;

/**
 * Initialize Element Generator
 *
 * @param config - configuration
 * @returns - a new Element Generator
 */
export function EG<P, PP extends EGProps<P> = EGProps<P>>(config?: EGIniConfig<P, PP>) {
  type OP = Optional<P, { [k in keyof PP]: PP[k] extends { optional: boolean } ? k : never }[keyof P]>;

  // Create Element Component based on a generator function - func
  return <This extends ComponentFuncThis<P> = ComponentFuncThis<P>>(func: ComponentFunc<P, This>) => {
    const constructor = build(func as ComponentFunc<P, ComponentFuncThis<P>>, config?.props || {}, config?.mapper);

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
      } as ElementComponent<typeof constructor, OP, This>;

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
function build<P>(
  func: ComponentFunc<P, ComponentFuncThis<P>>,
  props: EGProps<unknown>,
  mapper: EGMapper<P> = setProp
): CustomElementConstructor {
  const customEl = class extends HTMLElement implements ElementWithNodes {
    /** A flag will be true after connectedCallback hook */
    wasConnected: boolean = false;

    /** Nodes inside the Element */
    __N__ = {
      nodes: {},
      self: {
        count: 0,
        runKey: -1,
      },
    };

    // TODO: change to Symbol
    static attributes: { [x: string]: string } = {};
    static get observedAttributes() {
      return Object.values(this.attributes);
    }

    private _props: Partial<P> = {};
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

        actualEl = this;

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
          set: (value) => {
            mapper.apply(this, [pK as keyof P, value, attr]);
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
      this.generation = func.call(this, this.props);

      actualEl = this;
      this.generation!.next(this.props);
      this.wasConnected = true;
    }

    /**
     * LIFECYCLE
     * Invoked when one of the custom element's attributes is added, removed, or changed.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      // TODO: need to use the same logic as for props with mapping
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
 * Set and return a node ID in an actual Element
 *
 * @param key - a node unique key
 * @returns ID object
 */
export function setElNode(key?: string) {
  if (actualEl == null) {
    return;
  }

  const nodes = actualEl.__N__.nodes;
  const self = actualEl.__N__.self;

  let node: ElementNodeItem = { current: null };

  if (key != null) {
    if (nodes[key] == null) {
      nodes[key] = node;
    }

    node = nodes[key];
  } else if (actualEl.wasConnected && self.count > 0) {
    self.runKey++;
    self.runKey = self.runKey >= self.count ? 0 : self.runKey;

    node = nodes[self.runKey];
  } else {
    nodes[self.count] = node;
    self.count++;
  }

  return node;
}

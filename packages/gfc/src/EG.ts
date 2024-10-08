import { setProp } from "./utils/p.js";
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
  ElementNodeItem,
  EGProperty,
} from "./@types";
import { ViewRender } from "./@types/ViewRender";
import { View } from "./View.js";
import { getRef2Node } from "./NG.js";

let actualEl: (HTMLElement & { __innerNodes: Set<object> }) | null = null;

/**
 * Initialize Element Generator
 *
 * @param config - configuration
 * @returns - a new Element Generator
 */
export function EG<P, PP extends EGProps<P> = EGProps<P>>(
  this: View | void | undefined,
  config?: EGIniConfig<P, PP>,
) {
  type OP = Optional<
    P,
    {
      [k in keyof PP]: PP[k] extends { isReq: false } ? k : never;
    }[keyof P]
  >;

  // Create Element Component based on a generator function - func
  return <This extends ComponentFuncThis<P> = ComponentFuncThis<P>>(
    func: ComponentFunc<P, This>,
  ) => {
    const BaseEl = config?.options?.BaseElement ?? HTMLElement;
    const constructor = build(
      func as ComponentFunc<P, ComponentFuncThis<P>>,
      config?.props || {},
      config?.mapper,
      this?.getRenderFn().element,
      BaseEl,
    );

    // Return Element Component
    return (name: string) => {
      try {
        customElements.define(name, constructor, config?.options);
      } catch (e) {
        console.warn(e);
      }

      const component = function (_props: ElementComponentProps<OP>) {
        if (new.target != null) {
          return new constructor();
        } else {
          return customElements
            .whenDefined(name)
            .then(() => customElements.get(name));
        }
      } as ElementComponent<typeof constructor, OP, This>;

      component.adapter = <T>(func: AdapterFunc<OP, T>, defaultProps?: OP) =>
        func(name, defaultProps);

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
function build<P, BE extends typeof HTMLElement>(
  func: ComponentFunc<P, ComponentFuncThis<P>>,
  props: EGProps<unknown>,
  mapper: EGMapper<P> = setProp,
  render: ViewRender["element"] = (result) => result.value,
  BaseElement: BE,
): CustomElementConstructor {
  // There is Typescript issue for error "A mixin class must have a constructor with a single rest parameter of type 'any[]'."
  // @see: https://github.com/microsoft/TypeScript/issues/37142
  const customEl = class extends (BaseElement as unknown as typeof HTMLElement) {
    container = this;
    __innerNodes = new Set<object>();
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

    /** A list of required properties */
    private _reqProps: string[] = [];

    isScheduledNext = false;
    generation: Generator<any, void, P> | undefined;

    async next(props?: P) {
      this.props = props || this.props;

      if (!this.isScheduledNext && this.generation != null) {
        this.isScheduledNext = true;
        const generator = await Promise.resolve(this.generation);
        this.isScheduledNext = false;

        actualEl = this;

        render.call(this, generator.next(this.props));
      }
    }

    constructor() {
      super();

      for (const pK in props) {
        const pV: EGProperty<unknown> = props[pK];
        const attr: string | undefined = pV.attribute;

        if (pV.isReq) {
          this._reqProps.push(pK);
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
      const isNotReqProp = this._reqProps.some(
        (it) => this.props[it] === undefined,
      );

      if (isNotReqProp) {
        return;
      }

      this.generation = func.call(this, this.props);

      actualEl = this;
      render.call(this, this.generation!.next(this.props));
    }

    /**
     * LIFECYCLE
     * Invoked when one of the custom element's attributes is added, removed, or changed.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      // TODO: need to use the same logic as for props with mapping
      if (oldValue !== newValue) {
        for (const [attrKey, attrName] of Object.entries(
          this.constructor["attributes"],
        )) {
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
      const ref2Node = getRef2Node();
      this.__innerNodes.forEach((it) => {
        const node = ref2Node.get(it);

        if (node != null) {
          node.generator?.return();

          ref2Node.delete(it);
        }
      });
      this.generation?.return();
    }
  };

  // TODO: change to Symbol
  const attrKey = "attributes";
  const attributes = Reflect.get(customEl, attrKey);

  for (const pK in props) {
    const pV = props[pK];
    if ("type" in pV && pV.attribute !== undefined) {
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
 * Set and return a node ID in a current Element
 *
 * @param key - a node's unique key
 * @returns ID object
 */
export function setElNode(
  nodesSymbol: symbol,
  ref: { current: Node | null },
  key?: string,
) {
  // Don't connect a node to a current element if a ref.current is a Node
  // because it means that a user want to create a portal node
  if (ref.current != null) {
    return ref;
  }

  let node: ElementNodeItem = { current: null };

  // Return a new object every time if a Node was created outside any Element
  if (actualEl == null) {
    return node;
  }

  // Use initial ref object for nodes without keys
  if (key == null) {
    actualEl.__innerNodes.add(ref);

    return ref;
  }

  if (actualEl[nodesSymbol] == null) {
    actualEl[nodesSymbol] = {};
  }

  const nodes = actualEl[nodesSymbol];

  // Use a new object for unknown keys
  if (nodes[key] == null) {
    actualEl.__innerNodes.add(node);

    nodes[key] = node;
  }

  return nodes[key];
}

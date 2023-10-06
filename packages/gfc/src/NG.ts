import { View } from "./View.js";
import type { NodeRef } from "./@types";
import { setElNode } from "./EG.js";

type NodeDefaultProps = {
  key?: string;
};

type NodeFuncGenerator<P, TNext> = (
  this: NodeRef<P>,
  props: P,
) => Generator<unknown, void, TNext>;

const ref2Node = new WeakMap<object, NodeRef<any>>();

export const getRef2Node = () => ref2Node;

/**
 * Initialize Node Generator
 */
export function NG<Prop = {}, TNext = Prop>(
  this: View | void | undefined,
  func: NodeFuncGenerator<Prop, TNext>,
) {
  const render =
    this?.getRenderFn().node ??
    ((result: IteratorResult<any, void>) => result.value);

  // Create a new Node instance
  return (ref: { current: Node | null } = { current: null }) => {
    const nodesSymbol = Symbol("nodes");
    type FuncProp = NodeDefaultProps & Prop;

    // Return the Node instance's runner function
    return (props: FuncProp = {} as FuncProp): unknown => {
      const _ref = setElNode(nodesSymbol, ref, props.key);

      let node = ref2Node.get(_ref) as NodeRef<FuncProp> | undefined;

      if (node == null) {
        const _node: Partial<NodeRef<FuncProp>> = {
          ..._ref,
          props,
          isScheduledNext: false,
        };

        const generator: ReturnType<NodeFuncGenerator<FuncProp, unknown>> =
          Reflect.apply(func, _node, [props]);

        _node.generator = generator;

        _node.next = async function (
          this: NodeRef<FuncProp>,
          _props?: FuncProp,
        ) {
          this.props = _props || this.props;

          if (!this.isScheduledNext) {
            this.isScheduledNext = true;
            const g = await Promise.resolve(generator);
            this.isScheduledNext = false;
            this.value = render.call({ container: this }, g.next(this.props));
          }
        };

        node = _node as NodeRef<FuncProp>;

        ref2Node.set(_ref, node);
      }

      node.props = props;
      node.value = render.call({ container: node }, node.generator.next(props));
      return node.value;
    };
  };
}

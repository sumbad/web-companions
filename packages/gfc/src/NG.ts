import { View } from './View';
import type { NodeRef } from './@types';
import { setElNode } from './EG';

type NodeDefaultProps = {
  key?: string;
};

type NodeFuncGenerator<P, TNext> = (props: P) => Generator<unknown, void, TNext>;

const ref2Node = new WeakMap<object, NodeRef<any>>();

/**
 * Initialize Node Generator
 */
export function NG<Prop = {}, TNext = Prop>(this: View | void | undefined, func: NodeFuncGenerator<Prop, TNext>) {
  const render = (result: IteratorResult<any, void>, container: NodeRef<Prop>) => {
    if (this?.render.node != null && !result.done) {
      return this.render.node(container, result.value);
    } else {
      return result.value;
    }
  }

  // Create a new Node instance
  return (ref: { current: Node | null } = { current: null }) => {
    const nodesSymbol = Symbol('nodes');
    type FuncProp = NodeDefaultProps & Prop;

    // Return the Node instance's runner function
    return (props: FuncProp = {} as FuncProp): unknown => {
      const _ref = props.key != null ? setElNode(nodesSymbol, props.key) : ref;

      let node = ref2Node.get(_ref) as NodeRef<Prop> | undefined;

      if (node == null) {
        const _node: Partial<NodeRef<Prop>> = {
          ..._ref,
          props,
          isScheduledNext: false,
        };

        const generator: ReturnType<NodeFuncGenerator<Prop, unknown>> = Reflect.apply(func, _node, [props]);

        _node.generator = generator;

        _node.next = async function (this: NodeRef<Prop>) {
          if (!this.isScheduledNext) {
            this.isScheduledNext = true;
            const g = await Promise.resolve(generator);
            this.isScheduledNext = false;
            this.value = render(g.next(this.props), this);
          }
        };

        node = _node as NodeRef<Prop>;

        ref2Node.set(_ref, node);
      }

      node.props = props;
      node.value = render(node.generator.next(props), node);
      return node.value;
    };
  };
}

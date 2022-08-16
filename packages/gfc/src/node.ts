import type { NodeRef } from './@types';
import { setElNode } from './element';

type NodeDefaultProps = {
  key?: string;
};

type NodeFuncGenerator<P, TNext = {}> = (props: P) => Generator<unknown, void, TNext>;

const ref2Node = new WeakMap<object, NodeRef<any>>();

/**
 * Initialize Node Generator
 */
export function NG<Prop = {}, TNext = Prop>(func: NodeFuncGenerator<Prop, TNext>) {
  // Create a new Node instance
  return (ref: { current: Node | null } = { current: null }) => {
    const nodesSymbol = Symbol('nodes');
    type FuncProp = NodeDefaultProps & Prop;

    // Invoke the Node instance
    return (props: FuncProp = {} as FuncProp): unknown => {
      const _ref = props.key != null ? setElNode(nodesSymbol, props.key) : ref;

      let node = ref2Node.get(_ref) as NodeRef<Prop> | undefined;

      if (node == null) {
        const _node: Partial<NodeRef<Prop>> = {
          ..._ref,
          props,
          isScheduledNext: false,
        };

        const generator: ReturnType<NodeFuncGenerator<Prop>> = Reflect.apply(func, _node, [props]);

        _node.generator = generator;

        _node.next = async function (this: NodeRef<Prop>) {
          if (!this.isScheduledNext) {
            this.isScheduledNext = true;
            const g = await Promise.resolve(generator);
            this.isScheduledNext = false;
            this.value = g.next(this.props).value;
          }
        };

        node = _node as NodeRef<Prop>;

        ref2Node.set(_ref, node);
      }

      node.props = props;
      node.value = node.generator.next(props).value;
      return node.value;
    };
  };
}

import type { NodeRef } from './@types';
import { setElNode } from './element';

type NodeDefaultProps = {
  key?: string;
};

const ref2Node = new WeakMap<object, NodeRef<any>>();

/**
 * Initialize Node Generator
 */
export function NG<P = {}>(func: (props: P) => Generator<any, void, P>) {
  type Prop = NodeDefaultProps & P;
  type NodeReturn = keyof Prop extends [] ? (p?: Prop) => Prop : (p: Prop) => Prop;

  return (ref?: { current: Node | null }): NodeReturn => {
    return (props: Prop = {} as Prop) => {
      const _ref = ref != null ? ref : setElNode(props.key);

      if (_ref == null) {
        throw new Error('A ref node does not exist');
      }

      let node = ref2Node.get(_ref) as NodeRef<Prop> | undefined;

      if (node == null) {
        const _node: Partial<NodeRef<Prop>> = {
          ..._ref,
          props,
          isScheduledNext: false,
        };

        const generator = Reflect.apply(func, _node, [props]);

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

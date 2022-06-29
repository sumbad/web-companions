import type { NodeRef } from './@types';
import { setGetElNode } from './element';


type NodeDefaultProps = {
  key?: string;
}

/**
 * Initialize Node Generator
 */
export function NG<P = {}, N = {}>(func: (props: P) => Generator<any, void, N>) {
  type Prop = NodeDefaultProps & P;
  type NodeReturn = keyof Prop extends [] ? (p?: Prop) => Prop : (p: Prop) => Prop;

  return (ref?: { current: Node | null }): NodeReturn => {
    const node2Ref = new WeakMap<object, NodeRef<Prop>>();

    return (props: Prop = {} as Prop) => {
      const nodeRef = ref == null ? setGetElNode(props.key) : ref;
      let node: NodeRef<Prop> | undefined = node2Ref.get(nodeRef);

      if (node == null) {
        const _node: Partial<NodeRef<Prop>> = {
          ...nodeRef,
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

        node2Ref.set(nodeRef, node);
      }

      node.props = props;
      node.value = node.generator.next(props).value;
      return node.value;
    };
  };
}

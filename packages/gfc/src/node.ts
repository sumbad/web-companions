import type { ComponentFunc, NodeComponent, NodeRef } from './@types';
import { setElNode } from './element';

type NodeReturn<P> = P extends {} ? keyof P extends [] ? (p?: {}) => any : NodeComponent<P> : NodeComponent<P>; 

/**
 * Initialize Node Generator
 */
export function NG<P extends {} = {}>(func: ComponentFunc<P>) {
    return (ref?: { current: Node | null }): NodeReturn<P> => {
      const node2Ref = new WeakMap<object, NodeRef<P>>();

      return ((_props: P = {} as P) => {
        const props: P = (_props as any) || {};

        const nodeRef = ref == null ? setElNode({ current: null }) : ref;
        let node: NodeRef<P> | undefined = node2Ref.get(nodeRef);

        if (node == null) {
          const _node: Partial<NodeRef<P>> = {
            ...nodeRef,
            props,
            isScheduledNext: false,
          };

          const generator = Reflect.apply(func, _node, [props]);

          _node.generator = generator;

          _node.next = async function (this: NodeRef<P>) {
            if (!this.isScheduledNext) {
              this.isScheduledNext = true;
              const g = await Promise.resolve(generator);
              this.isScheduledNext = false;
              this.value = g.next(this.props).value;
            }
          };

          node = _node as NodeRef<P>;

          node2Ref.set(nodeRef, node);
        }

        node.props = props;
        node.value = node.generator.next(props).value;
        return node.value;
      }) as NodeReturn<P>;
    };
  };

import type { ComponentFunc } from '../common.model';
import { setElNode } from './element';

interface NodeRef<P> {
  current: Node | null;
  generator: Generator<any, void, P | undefined>;
  next: (...args: [] | [P]) => Promise<void>;
  isScheduledNext: boolean;
  props: P;
  value?: any;
}

/**
 * Initialize Node Generator
 */
export function NG() {
  return <P>(func: ComponentFunc<P>) => {
    return (ref?: { current: Node | null }) => {
      const node2Ref = new WeakMap<object, NodeRef<P>>();

      return (props: P & { ref?: { current: Node | null } }) => {
        const _ref = props?.ref || ref;
        const nodeRef = _ref == null ? setElNode({ current: null }) : _ref;
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
      };
    };
  };
}

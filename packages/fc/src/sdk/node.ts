import { AF, useRef } from '../hooks';
import type { ComponentFunc, NodeIniConfig } from '../common.model';

/**
 * Initialize Node Generator
 */
export function NG<FP, RT>(this: any, config: NodeIniConfig<RT>) {
  return <P>(func: ComponentFunc<P extends FP ? P : FP>) => {
    return (refNode?: { current: Node }) => {
      const node2Fn = new WeakMap();

      return (props: P) => {
        const node = refNode ? refNode : useRef(null);
        let rFn = node2Fn.get(node);

        if (rFn === undefined) {
          const aFunc = AF(func, (r: any) => config.render(r, node));
          
          rFn = (p = props) => aFunc(p); // TODO: what has better performance? [ Reflect.apply(aFunc, this, [p]);  ||  pF(p); ]

          node2Fn.set(node, rFn);
        }

        return rFn(props);
      };
    };
  };
}

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
        const ref = refNode ? refNode : useRef(null);
        let rFn = node2Fn.get(ref);

        if (rFn === undefined) {
          const aFunc = AF(func, (r: any) => config.render(r, ref));
          
          rFn = (p = props) => Reflect.apply(aFunc, ref.current, [p]);

          node2Fn.set(ref, rFn);
        }

        return rFn(props);
      };
    };
  };
}

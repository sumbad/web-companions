import { AF, useRef } from '../hooks';
import type { ComponentFunc, NodeIniConfig } from '../common.model';

/**
 * Initialize Node Generator
 */
export function NG(config: NodeIniConfig) {
  return <P>(func: ComponentFunc<P>) => {
    const node2Fn = new WeakMap();

    return (props: P) => {
      const node = useRef(null);
      let fn = node2Fn.get(node);
      if (fn === undefined) {
        fn = (p = props) => {
          const tpl = pF(p);
          return config.render(node, tpl);
        };

        const pF = AF(func, fn);
        node2Fn.set(node, fn);
      }

      return fn(props);
    };
  };
}

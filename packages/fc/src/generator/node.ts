import { AF, useRef } from '../hooks';
import type { ComponentFunc } from '../common.model';

/**
 * Node Generator
 * @param options
 */
export function NG<P>(func: ComponentFunc<P>, keyedRender: (object: object, id?: string | undefined) => any) {
  const node2Fn = new WeakMap();

  return (props: P) => {
    const node = useRef(null);
    let fn = node2Fn.get(node);
    if (fn === undefined) {
      // TODO: ??? fn = (_props = props)
      fn = () => {
        const tpl = pF(props);
        // TODO: hole keyedRender function should be passed out
        return keyedRender(node)`${tpl}`;
      };

      const pF = AF(func, fn);
      node2Fn.set(node, fn);
    }

    return fn(props);
  };
}

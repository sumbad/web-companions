import { AF, useRef } from '../hooks';
import type { ComponentFunc } from '../common.model';

export function NG<P>(func: ComponentFunc<P>, keyedRender: (object: object, id?: string | undefined) => any) {
  const node2Fn = new WeakMap();

  return (props: P) => {
    const node = useRef(null);
    let fn = node2Fn.get(node);
    if (fn === undefined) {
      fn = () => {
        const tpl = pF(props);
        return keyedRender(node)`${tpl}`;
      };

      const pF = AF(func, fn);
      node2Fn.set(node, fn);
    }

    return fn(props);
  };
}

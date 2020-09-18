import { augmentor, useRef } from 'augmentor';
import type { ComponentFunc } from './common.model';

export function VFC<P>(func: ComponentFunc<P>, keyedRender: (object: object, id?: string | undefined) => any) {
  const nodeFuncMap = new WeakMap();

  return (props: P) => {
    const currentNode = useRef(null);
    let currentFunc = nodeFuncMap.get(currentNode);
    if (currentFunc !== undefined) {
    } else {
      const pFunc = new Proxy(func, {
        apply: (target, thisArg, args) => {
          const temp = Reflect.apply(target, thisArg, args);

          return keyedRender(currentNode)`${temp}`;
        },
      });

      currentFunc = augmentor(pFunc);
      nodeFuncMap.set(currentNode, currentFunc);
    }

    return currentFunc(props);
  };
}

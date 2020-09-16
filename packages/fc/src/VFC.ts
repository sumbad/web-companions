import { augmentor, useRef } from 'augmentor';
import type { ComponentFunc } from './common.model';
import { html } from 'uhtml';

export function VFC<P>(func: ComponentFunc<P>) {
  const nodeFuncMap = new WeakMap();

  const vRender = (props: any) => {
    const currentNode = useRef(null);
    let currentFunc = nodeFuncMap.get(currentNode);
    if (currentFunc !== undefined) {
    } else {
      const pFunc = new Proxy(func, {
        apply: (target, thisArg, args) => {
          const temp = Reflect.apply(target, thisArg, args);
          return html.for(currentNode)`${temp}`;
        },
      });

      currentFunc = augmentor(pFunc);
      nodeFuncMap.set(currentNode, currentFunc);
    }

    return currentFunc(props);
  };

  return function (props: P) {
    return vRender(props);
  };
}

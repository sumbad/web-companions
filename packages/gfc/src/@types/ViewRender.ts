import { ComponentFuncThis, NodeRef } from './index';

export interface ViewRender {
  element: (this: ComponentFuncThis<any>, result: IteratorResult<any, void>) => void;
  node: (this: { container: NodeRef<any> }, result: IteratorResult<any, void>) => object | undefined;
}

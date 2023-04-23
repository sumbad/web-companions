import { NodeRef } from './index';

export interface ViewRender {
    element: (container: HTMLElement | DocumentFragment, value: unknown) => any;
    node: (container: NodeRef<any>, value: unknown) => any;
}

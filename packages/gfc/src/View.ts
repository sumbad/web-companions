import { ViewRender } from './@types/ViewRender';
import { EG } from './EG';
import { NG } from './NG';

export class View {
  element = EG;
  node = NG;

  constructor(private _render: ViewRender) {}

  getRenderFn() {
    return this._render;
  }
}

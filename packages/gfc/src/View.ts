import { ViewRender } from './@types/ViewRender';
import { EG } from './EG.js';
import { NG } from './NG.js';

export class View {
  element = EG;
  node = NG;

  constructor(private _render: ViewRender) {}

  getRenderFn() {
    return this._render;
  }
}

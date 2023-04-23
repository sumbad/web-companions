import { ViewRender } from './@types/ViewRender';
import { EG } from './EG';
import { NG } from './NG';

export class View {
  element = EG;
  node = NG;

  get render() {
    return this._render;
  }

  constructor(private _render: ViewRender) {}
}

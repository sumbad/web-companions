import { View } from '@web-companions/gfc';
import { render } from 'lit-html';
import { renderNode } from './directives';


export const litView = new View({
  element: (c, v) => render(v, c),
  node: (c, v) => renderNode(v, c),
});
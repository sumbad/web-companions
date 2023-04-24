import { View } from '@web-companions/gfc';
import { render } from 'lit-html';
import { renderNode } from './directives';

export const litView = new View({
  element(result) {
    render(result.value, this.container);
  },
  node(result) {
    return renderNode(result.value, this.container);
  },
});

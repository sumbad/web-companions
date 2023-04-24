import {View} from '@web-companions/gfc';
import type {NodeRef} from '@web-companions/gfc/@types';
import {render} from 'lit-html';
import {AsyncDirective} from 'lit-html/async-directive.js';
import {directive} from 'lit-html/directive.js';

class RenderNode extends AsyncDirective {
	render(tpl: any, ref: NodeRef<unknown, Node | null | RenderNode>) {
		ref.current = this;

		return tpl;
	}
}

const renderNodeDirective = directive(RenderNode);

function renderNode(tpl: any, ref: NodeRef<unknown, Node | null | RenderNode>) {
	if (ref.current instanceof HTMLElement) {
		render(tpl, ref.current);
		return undefined;
	}

	if (ref.current instanceof RenderNode) {
		ref.current.setValue(tpl);
	}

	return renderNodeDirective(tpl, ref);
}

export const litView = new View({
	element(result) {
		render(result.value, this.container);
	},
	node(result) {
		return renderNode(result.value, this.container);
	},
});

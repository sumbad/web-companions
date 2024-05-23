import { View } from "@web-companions/gfc";
import type { NodeRef } from "@web-companions/gfc/@types";
import { html, render } from "@github/jtml";
import { directive } from "@github/jtml/lib/directive.js";
import { processPart } from "@github/jtml/lib/html.js";
import { TemplatePart } from "@github/template-parts";

const renderNodeDirective = directive(
  (tpl: any, ref: NodeRef<unknown, Node | null | TemplatePart>) => (part) => {
    if (ref.current instanceof HTMLElement) {
      render(tpl, ref.current);
      return undefined;
    }

    ref.current = part;

    processPart(part, tpl);
  },
);

function renderNode(
  tpl: any,
  ref: NodeRef<unknown, Node | null | TemplatePart>,
) {
  if (ref.current instanceof HTMLElement) {
    render(tpl, ref.current);
    return undefined;
  }

  if (ref.current != null && "value" in ref.current) {
    processPart(ref.current, tpl);
  }

  return renderNodeDirective(tpl, ref);
}

export const view = new View({
  element(result) {
    render(result.value ?? html``, this.container);
  },
  node(result) {
    return renderNode(result.value, this.container);
  },
});

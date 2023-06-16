// TODO: replace /n, tabs and several spaces to one space
export const css = String.raw;

/**
 * Add or update a DOM element style
 *
 * @param style - element styles
 * @param node - the element
 * @param styleId - an optional parameter to create or recreate a style tag by id
 */
export function setStyle(style: string, node: ShadowRoot | Element, styleId?: string) {
  if (
    window.ShadowRoot &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype &&
    node instanceof ShadowRoot
  ) {
    const sheet = new CSSStyleSheet();
    sheet['replaceSync'](style);
    node['adoptedStyleSheets'] = [sheet];
  } else {
    const selector = `style${styleId != null ? `#${styleId}` : ''}`;
    let styleEl = node.querySelector(selector);

    if (styleEl == null) {
      styleEl = document.createElement('style');

      if (styleId != null) {
        styleEl.setAttribute('id', styleId);
      }

      styleEl.innerHTML = style;
      node.insertBefore(styleEl, node.firstChild);
    } else {
      styleEl.innerHTML = style;
    }
  }
}

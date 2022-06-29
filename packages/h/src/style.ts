// TODO: replace /n, tabs and several spaces to one space
export const css = String.raw;

/**
 * Add or update style to an Element
 * 
 * @param style - element styles
 * @param node - the element
 */
export function setStyle(style: string, node: ShadowRoot | Element) {
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
    let styleEl = node.querySelector('style');
    if (styleEl == null) {
      styleEl = document.createElement('style');
      styleEl.innerHTML = style;
      node.insertBefore(styleEl, node.firstChild);
    } else {
      styleEl.innerHTML = style;
    }
  }
}
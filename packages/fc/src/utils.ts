export async function createInstance<P>(properties?: P & Partial<HTMLElement> & { ref: {} }) {
  const elClass = await customElements.whenDefined(name).then(() => customElements.get(name));
  // TODO: need check, as I can see it doesn't work
  if (typeof properties === 'object') {
    for (const key in properties) {
      elClass[key] = properties[key];
    }
  }

  return elClass;
}


export function reflectAttrFromProp(el: Element, attrName: string, value: any) {
  if (el instanceof Element) {
    switch (typeof value) {
      case 'boolean':
        if (value) {
          el.setAttribute(attrName, '');
        } else {
          el.removeAttribute(attrName);
        }
        break;
      default:
        el.setAttribute(attrName, String(value));
        break;
    }
  }
}
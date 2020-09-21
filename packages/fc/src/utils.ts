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

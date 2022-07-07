/**
 * The easier and simples mapper for EG.
 * It will update a component's property immediately without waiting other changes.
 * 
 * Use it only if you want to maximal speed up you component. 
 * Pay attention that it's not possible to change several different properties inside one updating iteration with this mapper.
 *
 * @param key - a property's key
 * @param value - a property's value
 */
 export function instantMapper<P>(this: { props: P }, key: keyof P, value: any) {
  if (value !== this.props[key]) {
    this.props = { ...this.props, [key]: value };
  }
}
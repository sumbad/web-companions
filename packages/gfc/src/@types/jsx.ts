interface HTMLGlobalAttributes {
  children?: any;
  class?: string;
  style?: string;
  [x: string]: string | number | boolean | object | void | undefined;
}

type HTMLElementTagNameMapJSX = {
  [P in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[P]> | HTMLGlobalAttributes;
};

declare namespace JSX {
  /**
   * The type of a JSX expression result.
   *
   * `gfc` is view-agnostic: the actual template type (lit-html `TemplateResult`,
   * uhtml template, jtml result, etc.) is provided by the concrete view package.
   * `unknown` is the safe default so that JSX expressions don't fall back to
   * `any` (which makes type-aware linters report `unsafe-return`).
   */
  type Element = unknown;

  interface IntrinsicElements extends HTMLElementTagNameMapJSX {
    [elemName: string]: Partial<HTMLElement> | HTMLGlobalAttributes;
  }
  interface ElementAttributesProperty {
    props: any;
  }
}

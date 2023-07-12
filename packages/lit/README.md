<div align="center">
  <a href="https://www.npmjs.com/package/@web-companions/lit">
    <img src="https://img.shields.io/npm/v/@web-companions/lit.svg?maxAge=86400" alt="Last npm Registry Version">
  </a>
  <a href="https://bundlephobia.com/result?p=@web-companions/lit">
    <img alt="gzip size" src="https://img.shields.io/bundlephobia/minzip/@web-companions/lit" />
  </a>
</div>

<h1 align="center">@web-companions/lit</h1>

> A `@web-companions/gfc` preset for creating element and node Views with <a href="https://lit.dev/docs/libraries/standalone-templates">lit-html</a> render.

This package is useful for creating views – HTML Elements and Nodes. It's possible to develop any UI components. This package uses [lit-html](https://lit.dev/docs/libraries/standalone-templates) render under the hood.

---

## Table of contents

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

```
npm install @web-companions/lit --save
```

---

## Usage

For better DX suggest using this library with [babel-plugin-transform-jsx-to-tt](https://github.com/sumbad/babel-plugin-transform-jsx-to-tt).

**index.jsx**

```tsx
import { litView } from '@web-companions/lit';

/**
 * Counter element
 */
export const counterElement = litView.element({
  props: {
    msg: p.req<string>(),
  },
})(function* (props) {
  let count = 0;

  while (true) {
    props = yield (
      <>
        <button
          type="button"
          onclick={() => {
            count++;
            this.next();
          }}
        >
          {props?.msg}
        </button>
        <i>{count}</i>
      </>
    );
  }
});

// define a new custom Counter element with tag 'demo-counter-element'
const CounterElement = counterElement('demo-counter-element');

/**
 * ROOT element
 */
litView.element({
  props: {
    header: p.req<string>('header'),
  },
})(function* (props) {
  while (true) {
    props = yield (
      <div
        style={css`
          margin: 10px;
        `}
      >
        <h3>{props.header}</h3>

        <CounterElement msg={'Counter Element'}></CounterElement>
      </div>
    );
  }
})('demo-fc');
```

More examples are [here](https://github.com/sumbad/web-companions/tree/master/packages/gfc/demo/src).

---

> [MIT](./LICENSE) License

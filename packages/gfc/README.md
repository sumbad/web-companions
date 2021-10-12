<div align="center">
  <a href="https://www.npmjs.com/package/@web-companions/gfc">
    <img src="https://img.shields.io/npm/v/@web-companions/gfc.svg?logo=npm&maxAge=86400" alt="Last npm Registry Version">
  </a>
  <a href="https://github.com/sumbad/web-companions/actions/workflows/gfc.yml">
    <img src="https://github.com/sumbad/web-companions/actions/workflows/gfc.yml/badge.svg"/>
  </a>
  <a href="https://codecov.io/gh/sumbad/web-companions/tree/master/packages/gfc">
    <img src="https://codecov.io/gh/sumbad/web-companions/master/devlop/graph/badge.svg?flag=gfc"/>
  </a>
  <a href="https://bundlephobia.com/result?p=@web-companions/gfc">
    <img alt="gzip size" src="https://badgen.net/bundlephobia/minzip/@web-companions/gfc" />
  </a>
  <a href="https://bundlephobia.com/result?p=@web-companions/gfc">
    <img alt="gzip size" src="https://badgen.net/bundlephobia/min/@web-companions/gfc" />
  </a>
</div>

<h1 align="center">@web-companions/gfc</h1>

> Generator Functional Components. A wrapper for creating Web components with JS Generator function

## Features

- 🚀 **Fast**: Built with standards based Custom Elements and JS Generator.
- 🪂 **Typed**: Written in TypeScript.
- ⚛️ **JSX**: Can be used with JSX or without it ([babel-plugin-transform-jsx-to-tt](https://github.com/sumbad/babel-plugin-transform-jsx-to-tt)).
- 🪢 **Flexible**: Fit to different template libraries.
- 🧹 **No dependencies**

---

## Table of contents

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

```
npm install @web-companions/gfc --save
```

---

## Usage

For the best DX I suggest using this library with [babel-plugin-transform-jsx-to-tt](https://github.com/sumbad/babel-plugin-transform-jsx-to-tt) and lit-html or another library to rendering templates to DOM.

**index.jsx**

```tsx
import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';

/**
 * Counter element
 */
export const counterElement = EG({
  props: {
    msg: p.req<string>(),
  },
})(function* (props) {
  let count = 0;

  while (true) {
    props = yield render(
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
      </>,
      this
    );
  }
});

// define a new custom Counter element with tag 'demo-counter-element'
const CounterElement = counterElement('demo-counter-element');

/**
 * ROOT element
 */
EG({
  props: {
    header: p.req<string>('header'),
  },
})(function* (props) {
  while (true) {
    props = yield render(
      <div
        style={css`
          margin: 10px;
        `}
      >
        <h3>{props.header}</h3>

        <CounterElement msg={'Counter Element'}></CounterElement>

      </div>,
      this
    );
  }
})('demo-fc');
```

More examples are [here](https://github.com/sumbad/web-companions/tree/master/packages/gfc/demo/src).

---


### Notice

#### Node component
- This type of components could be created only inside an Element component.
- If some of Node components will be rendered by a condition we should create them with prepared ref objects. Otherwise, some of Nodes can start to use the same inner state.


## License
[MIT](./LICENSE)
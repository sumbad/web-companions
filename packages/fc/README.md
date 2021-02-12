<div align="center">
  <a href="https://www.npmjs.com/package/@web-companions/fc">
    <img src="https://img.shields.io/npm/v/@web-companions/fc.svg?maxAge=86400" alt="Last npm Registry Version">
  </a>
  <a href="https://bundlephobia.com/result?p=@web-companions/fc">
    <img alt="gzip size" src="https://badgen.net/bundlephobia/minzip/@web-companions/fc" />
  </a>
</div>

<h1 align="center">@web-companions/fc</h1>

> Functional Components. A wrapper for creating Web components like React.js components with hooks

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

```
npm install @web-companions/fc --save
```

---

## Usage

It's up to you, but I suggest using this library with [babel-plugin-transform-jsx-to-tt](https://github.com/sumbad/babel-plugin-transform-jsx-to-tt) and lit-html or another library to rendering templates to DOM.

**index.jsx**

```tsx
/**
 * ROOT element
 */
import { EG, NG, useEffect, useState } from '@web-companions/fc';
import { render } from 'lit-html';

EG({ render })(() => {
  const [state, setState] = useState<number>(1);

  useEffect(() => {
    setTimeout(() => {
      setState(10);
    }, 3000);
  }, []);

  return <div>{state}</div>;
})('demo-fc');
```

More examples are [here](https://github.com/sumbad/web-companions/tree/master/packages/fc/demo/src).

---

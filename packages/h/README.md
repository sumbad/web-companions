<div align="center">
  <a href="https://www.npmjs.com/package/@web-companions/h">
    <img src="https://img.shields.io/npm/v/@web-companions/h.svg?maxAge=86400" alt="Last npm Registry Version">
  </a>
</div>

<h1 align="center">@web-companions/h</h1>

> A set of helper functions

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

```
npm install @web-companions/h --save
```

---

## Usage

### css

**index.jsx**

```tsx
import { css } from '@web-companions/h';

<div>
  <span
    style={css`
      color: red;
    `}
  >
    Red text
  </span>
</div>
```


### setStyle

**index.jsx**

```tsx
import { setStyle } from '@web-companions/h';

// domNode is an Element or ShadowRoot
setStyle(require('./style.css'), domNode);
```


### instantMapper

The easier and simples mapper for EG.
It will update a component's property immediately without waiting other changes. 

NOTE: Use it only if you want to maximal speed up you component. 

! Pay attention that it's not possible to change several different properties inside one updating iteration with this mapper.

**index.jsx**

```tsx
import { instantMapper } from '@web-companions/h';
import { EG } from '@web-companions/gfc';
import { render } from 'lit-html';

let sum = 0;

export const demoElement = EG(
  mapper: instantMapper
)(function* () {
  let state: number = 0;

  const setState = (newState: number) => {
    state = newState;

    this.next();
  };

  while (true) {
    if (state < 5) {
      setState(++sum);
    }

    yield render(<div>Sum Immediate - {String(state)}</div>, this);
  }
});
```

---

## License
[MIT](./LICENSE)
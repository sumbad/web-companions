<div align="center">
  <a href="https://www.npmjs.com/package/@web-companions/react-adapter">
    <img src="https://img.shields.io/npm/v/@web-companions/react-adapter.svg?maxAge=86400" alt="Last npm Registry Version">
  </a>
  <a href="https://bundlephobia.com/result?p=@web-companions/react-adapter">
    <img alt="gzip size" src="https://badgen.net/bundlephobia/minzip/@web-companions/react-adapter" />
  </a>
</div>

<h1 align="center">@web-companions/react-adapter</h1>

> Creating an adapter for using a Functional Component (or any Custom Element) as a React.js component

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

```
npm install @web-companions/react-adapter --save
```

---

## Usage

**index.jsx**

```tsx
import React, { useRef, useEffect } from 'react';
import { loadingProgressBar } from 'loading-progress-bar';
import { elementToReact } from '@web-companions/react-adapter';

const LoadingProgressBarReact = loadingProgressBar.adapter(elementToReact, 'loading-progress-bar');

export default function Example() {
  const myRef = useRef(null);

  useEffect(() => {
    setInterval(() => {
      myRef.current.generateProgress.next();
    }, 3000);
  });

  return (
    <div>
      <LoadingProgressBarReact ref={myRef}></LoadingProgressBarReact>
    </div>
  );
}
```

---

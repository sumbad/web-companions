<div align="center">
  <a href="https://www.npmjs.com/package/@web-companions/gfc">
    <img src="https://img.shields.io/npm/v/@web-companions/gfc.svg?maxAge=86400" alt="Last npm Registry Version">
  </a>
  <a href="https://bundlephobia.com/result?p=@web-companions/gfc">
    <img alt="gzip size" src="https://badgen.net/bundlephobia/minzip/@web-companions/gfc" />
  </a>
</div>

<h1 align="center">@web-companions/gfc</h1>

> Generator Functional Components. A wrapper for creating Web components through JS Generator function

### Notice

#### Node component
- This type of components could be created only inside as Element component.
- If some of Node component will be rendered by a condition we should create it with a prepared ref object. Otherwise, some of Nodes can start to use the same state inside.
import { NG, useEffect, useState } from '@web-companions/fc';
import { html, render } from 'uhtml';

export const counterNode = NG({
  render: (t, n) => {
    if (n.current instanceof Node) {
      render(n.current, html`${t}`);
      return undefined;
    } else {
      const a = html.for(n)`${t}`;
      return a;
    }
  },
})(function(prop: { msg: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('connected CounterNode');
    return () => console.log('disconnected CounterNode');
  }, []);

  useEffect(() => {
    console.log('CounterNode', this);
  }, [count]);

  return (
    <>
      <button type="button" onclick={() => setCount(count + 1)}>
        {prop?.msg}
      </button>
      <i>{count}</i>
    </>
  );
});

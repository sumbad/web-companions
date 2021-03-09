import { EG, useEffect, useState } from '@web-companions/fc';
import { render } from 'uhtml';

export const counterEl = EG({
  props: {
    msg: String,
  },
  render: (t, n) => render(n, t),
})(function(prop: { msg: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('counterEl', this);
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

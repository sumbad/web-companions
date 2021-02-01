import { EG, useEffect, useState } from '@web-companions/fc';
import { render } from 'uhtml';

let sum = 0;

export const sumDeferred = EG({
  render: (t, n) => render(n, t),
})(function () {
  const [state, setState] = useState<number>();

  useEffect(() => {
    setTimeout(() => {
      setState(++sum);
    }, 1000);
  }, []);

  useEffect(() => {
    if (state < 5) {
      setTimeout(() => {
        setState(++sum);
      }, 500);
    }
  }, [state]);

  return (
    <>
      <div>Sum Deferred - {String(state)}</div>
    </>
  );
});

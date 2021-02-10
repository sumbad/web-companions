import { EG, useEffect, useState } from '@web-companions/fc';
import { render } from 'uhtml';



let sum = 0;

export const sumImmediate = EG({
  render: (t, n) => render(n, t)
})(function() {
  const [state, setState] = useState<number>();

  useEffect(() => {
      setState(++sum);
  }, []);

  useEffect(() => {
    if (state < 5) {
        setState(++sum);
    }
  }, [state]);

  return (
    <>
      <div>Sum Immediate - {String(state)}</div>
    </>
  );
})
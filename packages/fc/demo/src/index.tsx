import { EG, NG, useCallback, useEffect, useRef, useState } from '@web-companions/fc';
import { loadingProgressBarEl } from './loadingProgressBar';
import { html, render } from 'uhtml';

const CounterVirtual = NG({ render: (n, t) => html.for(n)`${t}` })((prop: { msg: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('connected CounterVirtual');
    return () => console.log('disconnected CounterVirtual');
  }, []);

  return (
    <>
      <button type="button" onclick={() => setCount(count + 1)}>
        {prop.msg}
      </button>
      <i>{count}</i>
    </>
  );
});

const LoadingProgressBarEl = loadingProgressBarEl.define('loading-progress-bar');

/**
 * ROOT element
 */
EG({ render })(() => {
  const myRef = useRef<{ generateProgress?: Generator }>({});

  const handleProgress = useCallback(() => {
    if (myRef.current.generateProgress !== undefined) {
      const r = myRef.current.generateProgress.next();
      console.log(JSON.stringify(r));
    }
  }, []);

  return (
    <>
      <LoadingProgressBarEl ref={myRef}></LoadingProgressBarEl>
      <button onclick={handleProgress}>Progress loading</button>
      <br />
      <br />
      {CounterVirtual({ msg: 'Virtual Counter as Expression' })}
      <br />
      <CounterVirtual msg="Virtual Counter as Element"></CounterVirtual>
    </>
  );
}).define('demo-fc');

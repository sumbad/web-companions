import { EG, NG, useCallback, useEffect, useRef, useState } from '@web-companions/fc';
import { loadingProgressBarEl } from './loadingProgressBar';
import { html, render } from 'uhtml';

const CounterVirtual = NG((prop: { msg: string }) => {
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
}, html.for);

const LoadingProgressBarEl = loadingProgressBarEl.define('loading-progress-bar');

/**
 * ROOT element
 */
EG(
  () => {
    const myRef = useRef<{ generateProgress?: Generator }>({});

    const handleProgress = useCallback(() => {
      if (myRef.current.generateProgress !== undefined) {
        const r = myRef.current.generateProgress.next();
        console.log(JSON.stringify(r));
      }
    }, []);

    return (
      <>
        <LoadingProgressBarEl
          config={{
            a: 1,
            b: '2',
          }}
          ref={myRef}
        ></LoadingProgressBarEl>
        <button onclick={handleProgress}>Progress loading</button>
        <br />
        <br />
        {CounterVirtual({ msg: 'Virtual Counter as Expression' })}
        <br />
        <CounterVirtual msg="Virtual Counter as Element"></CounterVirtual>
      </>
    );
  },
  { render }
).define('demo-fc');

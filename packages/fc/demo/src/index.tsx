import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'haunted';
import { FC } from '@web-companions/fc';
import { loadingProgressBar } from './loadingProgressBar';

function counter(prop: { head?: string }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <div id="count">{count}</div>
      <button type="button" onclick={() => setCount(count + 1)}>
        Increment {prop.head}
      </button>
    </>
  );
}

const CounterEl = FC(counter).element('counter-el', { observedAttributes: ['head'] });

const CounterVirtualAsExpression = FC((prop: { msg: string }) => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onclick={() => setCount(count + 1)}>
      {count} {prop.msg}
    </button>
  );
}).virtual();

const CounterVirtualAsElement = FC((prop: { msg: string }) => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onclick={() => setCount(count + 1)}>
      {count} {prop.msg}
    </button>
  );
}).virtual();


const LoadingProgressBarEl = loadingProgressBar.element('loading-progress-bar', { useShadowDOM: false });

/**
 * ROOT element
 */
FC(() => {
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
      <h1>Hello!</h1>
      <CounterEl head="Counter"></CounterEl>
      <br />
      <br />
      <div>{CounterVirtualAsExpression({ msg: 'Virtual Counter as Expression' })}</div>
      <br />
      <CounterVirtualAsElement msg="Virtual Counter as Element"></CounterVirtualAsElement>
    </>
  );
}).element('demo-fc');

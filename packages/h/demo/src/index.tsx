import { useState, useRef, useEffect, useCallback } from 'haunted';
import { FC, VC } from '@web-companions/h';
import { loadingProgressBarEl } from './loadingProgressBar.el';

function counterEl(prop: { head?: string }) {
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

// const Counter = dFC('counter-el', counterEl);
const Counter = FC('counter-el', counterEl, { observedAttributes: ['head'] });

const CounterVirtualAsExpression = VC((prop: { msg: string }) => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onclick={() => setCount(count + 1)}>
      {count} {prop.msg}
    </button>
  );
});

const CounterVirtualAsElement = VC((prop: { msg: string }) => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onclick={() => setCount(count + 1)}>
      {count} {prop.msg}
    </button>
  );
});

const LoadingProgressBar = FC('loading-progress-bar', loadingProgressBarEl, { useShadowDOM: false });

/**
 * ROOT element
 */
FC('demo-haunted-lit', () => {
  const myRef = useRef<any>(0);
  let generator: Generator;

  useEffect(() => {
    LoadingProgressBar().then(() => {
      generator = myRef.current.generateProgress();
    });
  }, []);

  const handleProgress = useCallback(() => {
    const r = generator.next();
    console.log(JSON.stringify(r));
  }, []);

  return (
    <>
      <LoadingProgressBar ref={myRef}></LoadingProgressBar>
      <button onclick={handleProgress}>Progress loading</button>
      <h1>Hello!</h1>
      <Counter head="Counter"></Counter>
      <br />
      <br />
      <div>{CounterVirtualAsExpression({ msg: 'Virtual Counter as Expression' })}</div>
      <br />
      <CounterVirtualAsElement msg="Virtual Counter as Element"></CounterVirtualAsElement>
    </>
  );
});

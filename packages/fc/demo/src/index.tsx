import { EG, NG, useCallback, useEffect, useRef, useState } from '@web-companions/fc';
import { loadingProgressBarElement } from './loadingProgressBar';
import { html, render } from 'uhtml';
import { sumDeferred } from './sumDeferred';
import { sumImmediate } from './sumImmediate';

const counterNode = NG({
  render: (t, n) => {
    if (n.current instanceof Node) {
      render(n.current, html`${t}`);
      return undefined;
    } else {
      const a = html.for(n)`${t}`;
      return a;
    }
  },
})((prop: { msg: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('connected CounterVirtual');
    return () => console.log('disconnected CounterVirtual');
  }, []);

  return (
    <>
      <button type="button" onclick={() => setCount(count + 1)}>
        {prop?.msg}
      </button>
      <i>{count}</i>
    </>
  );
});

const CounterNode = counterNode();
const LoadingProgressBarElement = loadingProgressBarElement('loading-progress-bar');
const SumDeferredElement = sumDeferred('sum-deferred');
const SumImmediateElement = sumImmediate('sum-immediate');


/**
 * ROOT element
 */
EG({
  render: (t, n) => render(n, t),
})(() => {
  const myRef = useRef<{ generateProgress?: Generator }>({});

  const handleProgress = useCallback(() => {
    if (myRef.current.generateProgress !== undefined) {
      const r = myRef.current.generateProgress.next();
      console.log(JSON.stringify(r));
    }
  }, []);

  const [DemoCounterPortalEl, setDemoCounterPortalEl] = useState<typeof CounterNode>();

  const [state, setState] = useState<number>(1);

  useEffect(() => {
    requestAnimationFrame(() => {
      const demoCounterPortalEl = document.querySelector('#demoCounterPortal');
      if (demoCounterPortalEl != null) {
        setDemoCounterPortalEl(() => counterNode({ current: demoCounterPortalEl }));
      }
    });
    setTimeout(() => {
      setState(10);
    }, 3000);
  }, []);

  return (
    <>
      {DemoCounterPortalEl && <DemoCounterPortalEl msg={'Node Counter Portal'}></DemoCounterPortalEl>}
      <LoadingProgressBarElement config={{ a: state, b: '1' }} ref={myRef}></LoadingProgressBarElement>
      <button onclick={handleProgress}>Progress loading</button>

      <br />
      <br />
      {CounterNode({ msg: 'Node Counter as Expression' })}
      <br />
      <CounterNode msg="Node Counter as Element"></CounterNode>
      <br />
      <SumDeferredElement></SumDeferredElement>
      <SumImmediateElement></SumImmediateElement>
    </>
  );
})('demo-fc');

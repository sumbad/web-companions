import { EG, NG, useCallback, useEffect, useRef, useState } from '@web-companions/fc';
import { loadingProgressBarElement } from './loadingProgressBar';
import { html, render } from 'uhtml';
import { sumDeferred } from './sumDeferred';
import { sumImmediate } from './sumImmediate';

const css = String.raw;

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

  const sectionStyle = css`
    margin-top: 10px;
  `;

  return (
    <div
      style={css`
        margin: 10px;
      `}
    >
      <section style={sectionStyle}>
        {DemoCounterPortalEl && <DemoCounterPortalEl msg={'Node Counter Portal'}></DemoCounterPortalEl>}
      </section>

      <LoadingProgressBarElement config={{ a: state, b: '1' }} ref={myRef}></LoadingProgressBarElement>

      <button onclick={handleProgress} style={sectionStyle}>
        Progress loading
      </button>

      <hr />

      <section style={sectionStyle}>{CounterNode({ msg: 'Node Counter as Expression' })}</section>

      <section style={sectionStyle}>
        <CounterNode msg="Node Counter as Element"></CounterNode>
      </section>

      <section style={sectionStyle}>
        <SumDeferredElement></SumDeferredElement>
        <SumImmediateElement></SumImmediateElement>
      </section>

      <hr />
    </div>
  );
})('demo-fc');

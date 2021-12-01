import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';
import { ref, createRef, Ref } from 'lit-html/directives/ref.js';
import { loadingProgressBarElement } from './loadingProgressBar.element';
import { sumDeferred } from './sumDeferred.element';
import { sumImmediate } from './sumImmediate.element';
import { counterElement } from './counter.element';
import { counterNode } from './counter.node';

const css = String.raw;

const CounterNode = counterNode();
const CounterElement = counterElement('demo-counter-element');
const LoadingProgressBarElement = loadingProgressBarElement('loading-progress-bar');
const SumDeferredElement = sumDeferred('sum-deferred');
const SumImmediateElement = sumImmediate('sum-immediate');

/**
 * ROOT element
 */
EG({
  props: {
    header: p.req<string>('header'),
  },
})(function* (props) {
  const myRef: Ref<HTMLElement & { generateProgress?: Generator }> = createRef();

  const handleProgress = () => {
    const loadingEl = myRef.value;
    if (loadingEl != null && loadingEl.generateProgress != null) {
      const r = loadingEl.generateProgress.next();
      console.log(JSON.stringify(r));
    }
  };

  let state = 1;
  const setState = (newState: number) => {
    state = newState;
    this.next();
  };

  const demoCounterPortalRef: { current: Element | null } = { current: null };

  requestAnimationFrame(() => {
    demoCounterPortalRef.current = document.querySelector('#demoCounterPortal');
    this.next();
  });

  setTimeout(() => {
    setState(20);
  }, 2000);

  setTimeout(() => {
    setState(30);
  }, 3000);

  setTimeout(() => {
    setState(40);
  }, 5000);

  const sectionStyle = css`
    margin-top: 10px;
  `;

  const nodeCounterRef = { current: null };
  const createCounterNode = (ref: { current: Element | null }) => (ref != null ? counterNode(ref) : () => null);

  while (true) {
    props = yield render(
      <div
        style={css`
          margin: 10px;
        `}
      >
        <h3>{props.header}</h3>

        <CounterElement msg={'Counter Element'}></CounterElement>

        <section style={sectionStyle}>
          {/* {DemoCounterPortalEl && <DemoCounterPortalEl msg={'Node Counter Portal'}></DemoCounterPortalEl>} @REVIEW: babel-plugin-transform-jsx-to-tt */}
          {demoCounterPortalRef.current && createCounterNode(demoCounterPortalRef)({ msg: 'Node Counter Portal' })}
        </section>

        <LoadingProgressBarElement config={{ a: state, b: '1' }} ref={ref(myRef)}></LoadingProgressBarElement>

        <button onclick={handleProgress} style={sectionStyle}>
          Progress loading
        </button>

        <hr />

        <section style={sectionStyle}>{CounterNode({ msg: 'Node Counter as Function' })}</section>
        
        {state >= 20 && (
          <section style={sectionStyle}>
            {createCounterNode(nodeCounterRef)({ msg: 'Node Counter as Function after 20 (should use a ref to prevent conflicts)' })}
          </section>
        )}

        <section style={sectionStyle}>
          <CounterNode msg="Node Counter as Element"></CounterNode>
        </section>

        <section style={sectionStyle}>
          <SumDeferredElement></SumDeferredElement>
          <SumImmediateElement></SumImmediateElement>
        </section>

        <hr />
      </div>,
      this
    );
  }
})('demo-fc');




// import { EG, prop } from '@web-companions/gfc';
// import { loadingProgressBarElement } from './loadingProgressBar.element';
// import { render } from 'uhtml';
// import { sumDeferred } from './sumDeferred.element';
// import { sumImmediate } from './sumImmediate.element';
// import { counterElement } from './counter.element';
// import { counterNode } from './counter.node';

// const css = String.raw;

// const CounterNode = counterNode();
// const CounterElement = counterElement('demo-counter-element');
// const LoadingProgressBarElement = loadingProgressBarElement('loading-progress-bar');
// const SumDeferredElement = sumDeferred('sum-deferred');
// const SumImmediateElement = sumImmediate('sum-immediate');

// /**
//  * ROOT element
//  */
// EG({
//   props: {
//     header: prop.req<string>('header'),
//   },
// })(function* (props) {
//   const myRef: { current: { generateProgress?: Generator } } = { current: {} };

//   const handleProgress = () => {
//     if (myRef.current.generateProgress !== undefined) {
//       const r = myRef.current.generateProgress.next();
//       console.log(JSON.stringify(r));
//     }
//   };

//   let state = 1;
//   const setState = (newState: number) => {
//     state = newState;
//     this.next();
//   };

//   const demoCounterPortalRef: {current: Element | null }= {current: null};

//   requestAnimationFrame(() => {
//     demoCounterPortalRef.current = document.querySelector('#demoCounterPortal');
//   });

//   setTimeout(() => {
//     setState(10);
//   }, 1000);

//   setTimeout(() => {
//     setState(20);
//   }, 2000);

//   setTimeout(() => {
//     setState(30);
//   }, 3000);

//   const sectionStyle = css`
//     margin-top: 10px;
//   `;

//   const nodeCounterRef = { current: null };

//   while (true) {
//     props = yield render(
//       this,
//       <div
//         style={css`
//           margin: 10px;
//         `}
//       >
//         <h3>{props.header}</h3>

//         <CounterElement msg={'Counter Element'}></CounterElement>

//         <section style={sectionStyle}>
//           {/* {DemoCounterPortalEl && <DemoCounterPortalEl msg={'Node Counter Portal'}></DemoCounterPortalEl>} @REVIEW: babel-plugin-transform-jsx-to-tt */}
//           {demoCounterPortalRef.current && CounterNode({ msg: 'Node Counter Portal', ref: demoCounterPortalRef })}
//         </section>

//         <LoadingProgressBarElement config={{ a: state, b: '1' }} ref={myRef}></LoadingProgressBarElement>

//         <button onclick={handleProgress} style={sectionStyle}>
//           Progress loading
//         </button>

//         <hr />

//         {state >= 20 && (
//           <section style={sectionStyle}>{CounterNode({ msg: `Node Counter as Expression ${state}`, ref: nodeCounterRef })}</section>
//         )}

//         <section style={sectionStyle}>
//           <CounterNode msg="Node Counter as Element"></CounterNode>
//         </section>

//         <section style={sectionStyle}>
//           <SumDeferredElement></SumDeferredElement>
//           <SumImmediateElement></SumImmediateElement>
//         </section>

//         <hr />
//       </div>
//     );
//   }
// })('demo-fc');

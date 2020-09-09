import { FC } from '@web-companions/fc';
import { useState, useEffect, useCallback, useRef } from 'augmentor';
import { loadingProgressBar } from './loadingProgressBar';
// import { html } from 'uhtml';

// FC(
//   {
//     a: { init: 1 },
//     aa: {
//       attribute: 'a-a',
//       init: 'aaaa',
//     },
//   },
//   function (props) {
//     console.log(8888, props.a, props.aa);

//     const [count, setCount] = useState(0);

//     useEffect(() => {
//       console.log(5555, count, this);
//     }, [count]);

//     const onChangeCount = useCallback(() => setCount((c) => c + 1), [setCount]);

//     return (
//       <>
//         <h1>{props.a}</h1>
//         <h2>{props.aa}</h2>
//         <p>{count}</p>
//         <button onclick={onChangeCount}>Progress loading</button>
//       </>
//     );
//     // return html`
//     //   <h1>----${props.a}----</h1>
//     //   <h2>----${props.aa}----</h2>
//     //   <p>${count}</p>
//     //   <button onclick=${onChangeCount}>Progress loading</button>
//     // `;
//   }
// );
// ).element('demo-fc');

// function test() {

//   const [count, setCount] = useState(0);

//   // log current count value
//   console.log(count);

//   // will invoke this augmented function each second
//   setTimeout(() => setCount(count + 1), 1000);
// }



// import { useState, useRef, useCallback } from 'haunted';
// import { FC } from '@web-companions/fc';
// import { loadingProgressBar } from './loadingProgressBar';

// function counter(prop: { head?: string }) {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       <div id="count">{count}</div>
//       <button type="button" onclick={() => setCount(count + 1)}>
//         Increment {prop.head}
//       </button>
//     </>
//   );
// }

// const CounterEl = FC(counter).element('counter-el', { observedAttributes: ['head'] });

// const CounterVirtualAsExpression = FC((prop: { msg: string }) => {
//   const [count, setCount] = useState(0);

//   return (
//     <button type="button" onclick={() => setCount(count + 1)}>
//       {count} {prop.msg}
//     </button>
//   );
// }).virtual();

// const CounterVirtualAsElement = FC((prop: { msg: string }) => {
//   const [count, setCount] = useState(0);

//   return (
//     <button type="button" onclick={() => setCount(count + 1)}>
//       {count} {prop.msg}
//     </button>
//   );
// }).virtual();

const LoadingProgressBarEl = loadingProgressBar.element('loading-progress-bar');

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

  console.log(111111, myRef);

  return (
    <>
      <LoadingProgressBarEl ref={myRef}></LoadingProgressBarEl>
      <button onclick={handleProgress}>Progress loading</button>
      <h1>Hello!</h1>
      {/* <CounterEl head="Counter"></CounterEl> */}
      <br />
      <br />
      {/* <div>{CounterVirtualAsExpression({ msg: 'Virtual Counter as Expression' })}</div> */}
      {/* <br /> */}
      {/* <CounterVirtualAsElement msg="Virtual Counter as Element"></CounterVirtualAsElement> */}
    </>
  );
}).element('demo-fc');

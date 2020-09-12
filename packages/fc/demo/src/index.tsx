import { FC } from '@web-companions/fc';
// import { useState, useEffect, useRef, useCallback, augmentor  as $} from 'augmentor';
import { augmentor as $, useEffect, useRef, useState, useCallback } from 'dom-augmentor';
import { loadingProgressBar } from './loadingProgressBar';
// import { html, render } from 'uhtml';
import { html as $html, render } from 'uhtml';
const html = (...args) => $html.for(useRef(null)).apply(null, args);

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

const CounterVirtualAsElement = FC(
  {
    msg: String,
  },
  (prop) => {
    const [count, setCount] = useState(0);

    // console.log('CounterVirtualAsElement', count);

    // setTimeout(() => {
    //   // console.log(count);

    //   setCount(count + 1);
    // }, 1000);

    return html`
      <>
        <button type="button" onclick=${() => setCount(count + 1)}>
          ${prop.msg}
        </button>
        <i>${count}</i>
      </>
    `;
  }
);

//.virtual();




const Button = () => $((text) => {
  useEffect(
    () => {
      console.log('connected');
      return () => console.log('disconnected');
    },
    []
  );
  const [i, increment] = useState(0);
  
  // console.log(1111);
  
  return html`
  <button onclick=${() => increment(i + 1)}>
    ${text} ${i}
  </button>`;
});

const button = Button();
// const button2 = Button('22222');

// render(document.body, button);






const LoadingProgressBarEl = loadingProgressBar.element('loading-progress-bar');

const h1 = document.createElement('div');
// const h2 = document.createElement('div');
// const CounterVirtualAsElement1 = CounterVirtualAsElement.virtual();
const CounterVirtualAsElement2 = CounterVirtualAsElement.virtual();
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

  // console.log(111111, CounterVirtualAsElement({ msg: '1111' }));
  // a();

  return (
    <>
      <LoadingProgressBarEl ref={myRef}></LoadingProgressBarEl>
      <button onclick={handleProgress}>Progress loading</button>
      {/* <h1>Hello!</h1> */}
      {/* <CounterEl head="Counter"></CounterEl> */}
      <br />
      <br />
      {/* <div>{CounterVirtualAsExpression({ msg: 'Virtual Counter as Expression' })}</div> */}
      {/* <br /> */}
      {/* { CounterVirtualAsElement1({ msg: 'sdfsdf' }) } */}

      {/* <CounterVirtualAsElement2 msg="Virtual Counter as Element"></CounterVirtualAsElement2> */}

      {/* {true ? CounterVirtualAsElement2({ msg: 'a', id: 'a' }) : undefined} */}

      {/* { button('11111') }
      { button('33333') } */}
     
      { Button()('11111') }
      { Button()('22222') }

      {CounterVirtualAsElement2({ msg: 'aaaaa' })}
      {CounterVirtualAsElement2({ msg: 'bbbbb' })}

      {/* <div>
        {[
          { id: '1', name: 1 },
          { id: '2', name: 2 },
          { id: '3', name: 3 },
        ].map(
          ({ id, name }) =>
            html`<li data-id=${id}>${name}</li>
              ${CounterVirtualAsElement2({ msg: id, id })}`
        )}
      </div> */}
    </>
  );
}).element('demo-fc');




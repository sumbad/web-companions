import { litView } from "@web-companions/lit";

export const counterNode = litView.node(function* (props: { msg: string }) {
  let count = 0;

  this.next(); // just for tests

  try {
    while (true) {
      props = yield (
        <>
          <button
            type="button"
            onclick={() => {
              count++, this.next();
            }}
          >
            {props?.msg}
          </button>
          <i>{count}</i>
        </>
      );
    }    
  } finally {
    console.log("A CounterNode with lit-html render was disconnected");
  }
});

// import { NG } from '@web-companions/gfc';
// import { html, render } from 'uhtml';

// function renderNode(node: { current: object | Node | null }, tpl: any) {
//   if (node.current instanceof Node) {
//     render(node.current, html`${tpl}`);
//     return undefined;
//   } else {
//     const a = html.for(node)`${tpl}`;
//     return a;
//   }
// }

// export const counterNode = NG()(function* (props: { msg: string }) {
//   let count = 0;

//   this.next(); // just for tests

//   while (true) {
//     props = yield renderNode(
//       this,
//       <>
//         <button
//           type="button"
//           onclick={() => {
//             count++, this.next();
//           }}
//         >
//           {props?.msg}
//         </button>
//         <i>{count}</i>
//       </>
//     );
//   }
// });

import { NG } from '@web-companions/gfc';
import { NodeRef } from '@web-companions/gfc/sdk/node';
import { render } from 'lit-html';
import { AsyncDirective } from 'lit-html/async-directive';
import { directive } from 'lit-html/directive';

class RenderNode extends AsyncDirective {
  render(tpl: any, ref: NodeRef<unknown, Node | null | RenderNode>) {
    ref.current = this;

    return tpl;
  }
}

const renderNodeDirective = directive(RenderNode);

const renderNode = (tpl: any, ref: NodeRef<unknown, Node | null | RenderNode>) => {
  if (ref.current instanceof HTMLElement) {
    render(tpl, ref.current);
    return undefined;
  }

  if(ref.current instanceof RenderNode) {
    ref.current.setValue(tpl);
  }

  return renderNodeDirective(tpl, ref);
};

export const counterNode = NG()(function* (props: { msg: string }) {
  let count = 0;

  this.next(); // just for tests

  while (true) {
    props = yield renderNode(
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
      </>,
      this
    );
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

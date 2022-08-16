import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';
import { counterNode } from './counter.node';

const CounterNode = counterNode();
const CounterNode1 = counterNode();

export const counterElement = EG({
  props: {
    msg: p.req<string>(),
  },
})(function* (props) {
  let count = 0;
  let isShowingTempEl = false;

  setTimeout(() => {
    isShowingTempEl = true;
    this.next();
  }, 1000);

  try {
    while (true) {
      props = yield render(
        <>
          <button
            type="button"
            onclick={() => {
              count++;
              this.next();
            }}
          >
            {props?.msg}
          </button>
          <i>{count}</i>

          <CounterNode key="1" msg="CounterNode as JSX Tag1"></CounterNode>

          <CounterNode key="2" msg="CounterNode as JSX Tag2"></CounterNode>

          <CounterNode msg="CounterNode as JSX Tag3"></CounterNode>

          {isShowingTempEl && <CounterNode1 msg="CounterNode as JSX Tag4"></CounterNode1>}
        </>,
        this
      );
    }
  } finally {
    console.log('A CounterElement was disconnected');
  }
});

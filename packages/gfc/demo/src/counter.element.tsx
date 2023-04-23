import { p } from '@web-companions/gfc';
import { counterNode } from './counter.node';
import { litView } from './utils/lit.view';

const CounterNode = counterNode();
const CounterNode1 = counterNode();

export const counterElement = litView.element({
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
      props = yield (
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
        </>
      );
    }
  } finally {
    console.log('A CounterElement was disconnected');
  }
});

import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';
import { counterNode } from './counter.node';

const CounterNode = counterNode();

export const counterElement = EG({
  props: {
    msg: p.req<string>(),
  },
})(function* (props) {
  let count = 0;
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

          <CounterNode msg="CounterNode as JSX Tag1"></CounterNode>

          <CounterNode msg="CounterNode as JSX Tag2"></CounterNode>

          <CounterNode msg="CounterNode as JSX Tag3"></CounterNode>
        </>,
        this
      );
    }
  } finally {
    console.log('A CounterElement was disconnected');
  }
});

import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';

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
        </>,
        this
      );
    }
  } finally {
    console.log('A CounterElement was disconnected');
  }
});

import { EG, prop } from '@web-companions/gfc';
import { render } from 'uhtml';

export const counterElement = EG({
  props: {
    msg: prop.req<string>(),
  },
})(function* (props) {
  let count = 0;

  while (true) {
    props = yield render(
      this,
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
      </>
    );
  }
});

import { EG } from '@web-companions/gfc';
import { render } from 'uhtml';

export const counterEl = EG({
  props: {
    msg: String,
  },
})(function* (prop: { msg: string }) {
  let count = 0;

  while (true) {
    prop = yield render(
      this,
      <>
        <button
          type="button"
          onclick={() => {
            count++;
            this.next();
          }}
        >
          {prop?.msg}
        </button>
        <i>{count}</i>
      </>
    );
  }
});

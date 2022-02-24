import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';

export const updatePropsWithNextElement = EG({
  props: {
    p1: p.req<string>(),
  },
})(function* (params) {
  for (;;) {
    params = yield render(
      <>
        <span>Value p1 - {params.p1}</span>
        <button id="test1" onclick={() => this.next({ p1: 'test1' })}>Set "test1"</button>
        <button id="test2" onclick={() => this.next({ p1: 'test2' })}>Set "test2"</button>
        <button id="test3" onclick={() => this.next({ p1: 'test3' })}>Set "test3"</button>
        <button id="test4" onclick={() => this.next()}>Update without value change</button>
      </>,
      this
    );
  }
});

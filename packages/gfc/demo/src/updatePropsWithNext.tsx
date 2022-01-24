import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';

export const updatePropsWithNextElement = EG({
  props: {
    p1: p.opt<string>(),
  },
})(function* (params = { p1: 'initial value' }) {
  setTimeout(() => {
    this.next({
      p1: 'new value after 1s'
    });
  }, 1000);

  setTimeout(() => {
    this.next({
      p1: 'new value after 2s'
    });
  }, 2000);

  setTimeout(() => {
    this.next({
      p1: 'new value after 3s'
    });
  }, 3000);

  for (;;) {
    params = yield render(<div>{params.p1}</div>, this);
  }
});

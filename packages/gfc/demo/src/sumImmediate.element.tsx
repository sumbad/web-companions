import { EG } from '@web-companions/gfc';
import { render } from 'uhtml';

let sum = 0;

export const sumImmediate = EG()(function* () {
  let state: number = 0;

  const setState = (newState: number) => {
    state = newState;

    this.next();
  };

  while (true) {
    if (state < 5) {
      setState(++sum);
    }

    yield render(this, <div>Sum Immediate - {String(state)}</div>);
  }
});

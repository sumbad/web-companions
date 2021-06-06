import { EG } from '@web-companions/gfc';
import { render } from 'lit-html';

let sum = 0;

export const sumDeferred = EG()(function* () {
  let state: number = 0;

  const setState = (newState: number) => {
    state = newState;
    this.next();
  };

  setTimeout(() => {
    setState(++sum);
  }, 1000);

  while (true) {
    if (state > 0 && state < 5) {
      setTimeout(() => {
        setState(++sum);
      }, 500);
    }

    yield render(
      <>
        <div>Sum Deferred - {String(state)}</div>
      </>,
      this
    );
  }
});

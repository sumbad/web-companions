import { litView } from '@web-companions/lit';

export const updatePropsWithNextNode = litView.node(function* (params: { p1: string }) {
  while (true) {
    params = yield (
      <>
        <span>Value p1 - {params.p1}</span>
        <button id="test1" onclick={() => this.next({ p1: 'test1' })}>
          Set temporally "test1"
        </button>
        <button id="test2" onclick={() => this.next({ p1: 'test2' })}>
          Set temporally "test2"
        </button>
        <button id="test3" onclick={() => this.next({ p1: 'test3' })}>
          Set temporally "test3"
        </button>
        <button id="test4" onclick={() => this.next()}>
          Update without value change
        </button>
      </>
    );
  }
});

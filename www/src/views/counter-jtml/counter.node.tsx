import { view } from "@web-companions/jtml";

export const counterNode = view.node(function* (props: { msg: string }) {
  let count = 0;

  this.next(); // just for tests

  try {
    while (true) {
      props = yield (
        <>
          <button
            type="button"
            onclick={() => {
              count++, this.next();
            }}
          >
            {props?.msg}
          </button>
          <i>{count}</i>
        </>
      );
    }
  } finally {
    console.log("A CounterNode with jtml render was disconnected");
  }
});

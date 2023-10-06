import { counterNode } from "./counter.node";
import { view, p } from "@web-companions/jtml";
import { is } from "@web-companions/h/template";

const CounterNode = counterNode();
const CounterNode1 = counterNode();

export const counterElement = view.element({
  props: {
    msg: p.req<string>(),
  },
})(function* (props) {
  let count = 0;
  let isShowingTempEl = false;

  setTimeout(() => {
    isShowingTempEl = true;
    this.next();
  }, 2000);

  try {
    while (true) {
      props = yield (
        <div class="container">
          <div class="row">
            <button
              class="btn"
              type="button"
              onclick={() => {
                count++;
                this.next();
              }}
            >
              {props?.msg}
            </button>
            <i>{count}</i>
          </div>

          <CounterNode key="1" msg="Counter Node as JSX Tag1"></CounterNode>

          <CounterNode key="2" msg="Counter Node as JSX Tag2"></CounterNode>

          <CounterNode msg="Counter Node as JSX Tag3"></CounterNode>

          {is(
            isShowingTempEl,
            <CounterNode1 msg="Counter Node as JSX By condition"></CounterNode1>,
          )}
        </div>
      );
    }
  } finally {
    console.log("A CounterElement with jtml render was disconnected");
  }
});

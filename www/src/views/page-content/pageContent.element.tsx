import { p } from "@web-companions/gfc";
import { litView } from "@web-companions/lit";
import { counterElement } from "../counter/counter.element";
import { DemoMenuItem } from "../../main";
import { ghGistElement } from "../gh-gist/ghGist.element";

const CounterElement = counterElement("demo-counter");
const GhGistElement = ghGistElement("demo-gh-gist");

export const pageContentElement = litView.element({
  props: {
    activePage: p.req<DemoMenuItem>(),
  },
})(function* (params) {
  let DemoView: any = () => <></>;
  let gists: {
    title: string;
    sharedLink: string;
  }[] = [];

  while (true) {
    switch (params.activePage) {
      case "get_started":
        DemoView = () => <h1>🚧 WIP</h1>;
        gists = [];
        break;
      case "counter":
        DemoView = () => (
          <>
            <h2>▶️ Demo. Counter</h2>
            <CounterElement msg={"Counter Element"}></CounterElement>
          </>
        );
        gists = [
          {
            title: "🛠️ Source code",
            sharedLink:
              "https://gist.github.com/sumbad/7d0ee6ad3f9282cfd3c99cb6ddbedc6b",
          },
        ];
        break;

      default:
        DemoView = () => <></>;
        gists = [];
        break;
    }

    params = yield (
      <div class="page-content">
        <DemoView />
        <hr></hr>
        {gists.map((it) => (
          <>
            <h3>{it.title}</h3>
            <GhGistElement sharedLink={it.sharedLink}></GhGistElement>
          </>
        ))}
      </div>
    );
  }
});

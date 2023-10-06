import { p } from "@web-companions/gfc";
import { litView } from "@web-companions/lit";
import { counterElement as counterLitElement } from "../counter/counter.element";
import { counterElement as counterJtmlElement } from "../counter-jtml/counter.element";
import { DemoMenuItem } from "../../main";
import { ghGistElement } from "../gh-gist/ghGist.element";

const CounterJtmlElement = counterJtmlElement("demo-counter-jtml");
const CounterLitElement = counterLitElement("demo-counter-lit");
const GhGistElement = ghGistElement("demo-gh-gist");

export const pageContentElement = litView.element({
  props: {
    activePage: p.req<DemoMenuItem>(),
  },
})(function* (params) {
  let demo = {
    title: () => <></>,
    menu: () => <></>,
    content: () => <></>,
    gists: () => <></>,
  };

  let selectedItem: string | null = null;

  const handleSelectedItem = (item: string) => () => {
    selectedItem = item;
    this.next();
  };

  const MenuTemplateRenders = () => (
    <nav class="navbar">
      <div class="container">
        <ul class="navbar-list">
          <li class="navbar-item">
            <a class="navbar-link" onclick={handleSelectedItem("jtml")}>
              jtml render
            </a>
            <a class="navbar-link" onclick={handleSelectedItem("lit")}>
              lit-html render
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );

  while (true) {
    switch (params.activePage) {
      case "get_started":
        demo = {
          title: () => <h1>🚧 WIP</h1>,
          content: () => <></>,
          menu: () => <></>,
          gists: () => <></>,
        };
        break;
      case "counter":
        demo = {
          ...demo,
          title: () => <h2>▶️ Demo. Counter</h2>,
          menu: MenuTemplateRenders,
          content: () => (
            <CounterJtmlElement msg={"Counter Element"}></CounterJtmlElement>
          ),
          gists: () => (
            <GhGistElement
              sharedLink={
                "https://gist.github.com/sumbad/7d0ee6ad3f9282cfd3c99cb6ddbedc6b"
              }
            ></GhGistElement>
          ),
        };

        if (selectedItem === "lit") {
          demo.content = () => (
            <CounterLitElement msg={"Counter Element"}></CounterLitElement>
          );
          demo.gists = () => (
            <GhGistElement
              sharedLink={
                "https://gist.github.com/sumbad/7d0ee6ad3f9282cfd3c99cb6ddbedc6b"
              }
            ></GhGistElement>
          );
        }

        break;

      default:
        demo = {
          title: () => <></>,
          content: () => <></>,
          menu: () => <></>,
          gists: () => <></>,
        };
        break;
    }

    params = yield (
      <div class="page-content">
        {demo.title()}
        {demo.menu()}
        {demo.content()}
        <hr></hr>
        <h3>🛠️ Source code</h3>
        {demo.gists()}
      </div>
    );
  }
});

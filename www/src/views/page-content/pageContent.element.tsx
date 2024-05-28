import { p } from "@web-companions/gfc";
import { litView } from "@web-companions/lit";
import { counterElement as counterLitElement } from "../counter-lit/counter.element";
import { counterElement as counterJtmlElement } from "../counter-jtml/counter.element";
import { DemoMenuItem } from "../../main";
import { ghGistElement } from "../gh-gist/ghGist.element";
import { getStartedElement } from "../get-started/getStarted.element";
import { is } from "@web-companions/h/template";
import { introductionElement } from "../introduction/Introduction.element";

const CounterJtmlElement = counterJtmlElement("demo-counter-jtml");
const CounterLitElement = counterLitElement("demo-counter-lit");
const GhGistElement = ghGistElement("demo-gh-gist");
const GetStartedElement = getStartedElement("get-started");
const IntroductionElement = introductionElement("companions-introduction");

export const pageContentElement = litView.element({
  props: {
    activePage: p.req<DemoMenuItem>(),
  },
})(function* (params) {
  let demo: {
    title: () => object;
    content: () => object;
    menu?: () => object;
    gists?: () => object;
  } = {
    title: () => <></>,
    content: () => <></>,
    menu: () => <></>,
    gists: () => <></>,
  };

  let selectedItem: string = "lit";

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
      case "introduction":
        demo = {
          title: () => <h1>🤔 Introduction</h1>,
          content: () => <IntroductionElement></IntroductionElement>,
        };
        break;
      case "get_started":
        demo = {
          title: () => <h1>🎬 Get started</h1>,
          content: () => <GetStartedElement></GetStartedElement>,
        };
        break;
      case "counter":
        if (selectedItem === "jtml") {
          demo = {
            title: () => <h2>▶️ Demo. Counter</h2>,
            // menu: MenuTemplateRenders,
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
        }

        if (selectedItem === "lit") {
          demo = {
            title: () => <h2>▶️ Demo. Counter</h2>,
            // menu: MenuTemplateRenders,
            content: () => (
              <CounterLitElement msg={"Counter Element"}></CounterLitElement>
            ),
            gists: () => (
              <GhGistElement
                sharedLink={
                  "https://gist.github.com/sumbad/7d0ee6ad3f9282cfd3c99cb6ddbedc6b"
                }
              ></GhGistElement>
            ),
          };
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
        {demo.menu?.()}
        {demo.content()}
        {is(
          demo.gists != null,
          <>
            <hr></hr>
            <hr></hr>
            <h3>🛠️ Source code</h3>
            {demo.gists?.()}
          </>,
        )}
      </div>
    );
  }
});

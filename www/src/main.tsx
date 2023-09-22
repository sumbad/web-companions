import { litView } from "@web-companions/lit";
import { setStyle } from "@web-companions/h/style";
import { sidemenuElement } from "./views/sidemenu/sidemenu.element";
import mainCss from "./main.css";
import { pageContentElement } from "./views/page-content/pageContent.element";

const SidemenuElement = sidemenuElement("demo-sidemenu");
const PageContentElement = pageContentElement("demo-page-content");

const menu = {
  get_started: {
    label: "Get started",
    category: true,
    available: true,
  },
  demo: {
    label: "Demo",
    category: true,
  },
  counter: {
    label: "Counter",
    parent: "demo",
    available: true,
  },
} as const;

export type DemoMenuItem = keyof typeof menu;

/**
 * ROOT element
 */
litView.element()(function* () {
  setStyle(mainCss, this.container);

  let activePage: DemoMenuItem = "counter";

  const onchangeActive = (event: { detail: { key: string | number } }) => {
    console.log(event.detail.key);

    activePage = event.detail.key as DemoMenuItem;

    this.next();
  };

  while (true) {
    yield (
      <>
        <SidemenuElement
          searchPlaceholder="Поиск"
          data={menu}
          activeMenuItem="get_started"
          onchangeActive={onchangeActive}
        >
          <footer>
            <small>&copy; web-companions</small>
          </footer>
        </SidemenuElement>

        <div class="demo-content">
          <PageContentElement activePage={activePage} />
        </div>
      </>
    );
  }
})("www-main");

import { litView } from "@web-companions/lit";
import { setStyle } from "@web-companions/h/style";
import { sidemenuElement } from "./views/sidemenu/sidemenu.element";
import mainCss from "./main.css";
import { pageContentElement } from "./views/page-content/pageContent.element";

const SidemenuElement = sidemenuElement("demo-sidemenu");
const PageContentElement = pageContentElement("demo-page-content");

const gitHubIcon = litView.node(function* () {
  while (true) {
    yield (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-brand-github"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
      </svg>
    );
  }
});

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
            <a href="https://github.com/sumbad/web-companions">{gitHubIcon()()} web-companions</a>
          </footer>
        </SidemenuElement>

        <div class="demo-content">
          <PageContentElement activePage={activePage} />
        </div>
      </>
    );
  }
})("www-main");

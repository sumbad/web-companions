import { p } from "@web-companions/gfc";
import { setStyle } from "@web-companions/h/style";
import { litView } from "@web-companions/lit";
import { Ref, createRef, ref } from "lit-html/directives/ref.js";
import style from "./styles/sidemenu.css";

/**
 * Interface for input date type
 */
export interface SideMenuItem {
  label: string;
  parent?: string;
  available?: boolean;
  category?: boolean;
  hide?: boolean;
}

/**
 * Side menu web component
 */
export const sidemenuElement = litView.element({
  props: {
    /** placeholder text for search input */
    searchPlaceholder: p.opt<string>("search-placeholder"),
    /** menu data */
    data: p.req<{ [x: string]: SideMenuItem }>(),
    /** last selected menu item */
    activeMenuItem: p.req<string>(),
  },
})(function* (params) {
  this.container = this.attachShadow({ mode: "open" });
  setStyle(style, this.container);

  const inputElRef: Ref<HTMLDivElement> = createRef();
  // list of hided menu items (after filter)
  const _hideMenuItems: string[] = [];

  /**
   * Handler for click by menu item
   *
   * @param event - click event
   * @param itemKey - item ID
   */
  const handleMenuLinkClick = (event: MouseEvent, itemKey: string) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(itemKey);
    
    if (params.data[itemKey].available) {
      params.activeMenuItem = itemKey;
      const changeActiveEvent = new CustomEvent("changeActive", {
        detail: {
          ...params.data[itemKey],
          key: itemKey,
        },
      });
      dispatchEvent(changeActiveEvent);
    }
  };

  /**
   * Handler for keyup inside search field
   *
   * @param event - keyup event
   */
  const handleSearchKeyup = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event && event.target) {
      search(event.target["value"]);
    }
  };

  /**
   * Filter menu items by text inside search field
   *
   * @param searchFor - text from search field
   */
  const search = (searchFor: string) => {
    _hideMenuItems.length = 0;

    for (const item in params.data) {
      if (
        params.data[item].label
          .toLowerCase()
          .indexOf(searchFor.toLowerCase()) === -1
      ) {
        _hideMenuItems.push(item);
      }
    }
    this.next();
  };

  /**
   * Create a sub-menu template base on data
   *
   * @param parent - parent item key
   */
  function makeMenu(parent: string | null = null): undefined | object[] {
    // nested menu level
    let deepLevel = 0;
    const findLevel = (item: SideMenuItem): void => {
      if (item !== undefined) {
        deepLevel++;
        if (item.parent !== undefined) {
          findLevel(params.data[item.parent]);
        }
      }
    };
    params.data && parent && findLevel(params.data[parent]);

    return (
      params.data &&
      Object.keys(params.data)
        .filter((key) => (params.data[key].parent || null) === parent)
        .map((key) => {
          const styles = [];
          params.data[key].available && styles.push("cursor: pointer");

          if (params.data[key].category) {
            const categoryCssClass = ["insum-menu-category__title"];
            params.activeMenuItem === key &&
              categoryCssClass.push("insum-menu-category__title_active");
            return params.data[key].hide ? undefined : (
              <div class="insum-menu-category">
                <span
                  onclick={(e) => handleMenuLinkClick(e, key)}
                  class={categoryCssClass.join(" ")}
                  style={styles.join(";")}
                >
                  {params.data[key].label}
                </span>
                {makeMenu(key)}
              </div>
            );
          } else {
            const linkCssClass = ["insum-menu-category__link"];
            params.activeMenuItem === key &&
              linkCssClass.push("insum-menu-category__link_active");
            _hideMenuItems.includes(key) &&
              linkCssClass.push("insum-menu-category__link_hide");

            styles.push(`padding-left: ${deepLevel * 10 + 10}px`);
            return params.data[key].hide ? undefined : (
              <>
                <div
                  onclick={(e) => handleMenuLinkClick(e, key)}
                  class={linkCssClass.join(" ")}
                  style={styles.join(";")}
                >
                  {params.data[key].label}
                </div>
                {makeMenu(key)}
              </>
            );
          }
        })
    );
  }

  requestAnimationFrame(() => {
    inputElRef.value?.focus();
  });

  while (true) {
    params.searchPlaceholder ??= "";

    params = yield (
      <div class="insum-menu__sidenav">
        <div class="insum-menu-search">
          <insum-search-icon class="insum-menu-search__icon"></insum-search-icon>
          <input
            onkeyup={handleSearchKeyup}
            type="text"
            placeholder={params.searchPlaceholder}
            ref={ref(inputElRef)}
          />
        </div>
        {makeMenu()}
        <slot></slot>
      </div>
    );
  }
});

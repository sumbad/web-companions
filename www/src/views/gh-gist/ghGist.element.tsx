import { p } from "@web-companions/gfc";
import { litView } from "@web-companions/lit";
import { ref, createRef, Ref } from "lit-html/directives/ref.js";
import ghGistCss from "./ghGist.css";
import ghGistIframeCss from "./ghGistIframe.css";
import { setStyle } from "@web-companions/h/style";

export const ghGistElement = litView.element({
  props: {
    sharedLink: p.req<string>("iframeid"),
  },
})(function* (params) {
  setStyle(ghGistCss, this.container);

  const iframeRef: Ref<HTMLIFrameElement> = createRef();

  requestAnimationFrame(() => {
    const iframeEl = iframeRef.value;

    if (iframeEl == null) {
      return;
    }

    const iframeElWindow = iframeEl["contentWindow"];
    let doc = iframeEl["contentDocument"] || iframeElWindow?.document;

    if (doc == null) {
      return;
    }

    doc.open();

    doc.write(
      /*html*/ `
      <html>
        <body>
          <scr` +
        `ipt type="text/javascript" src="${params.sharedLink}.js"></sc` +
        `ript>
        </body>
      </html>
      `,
    );

    doc.close();

    if (iframeElWindow == null) {
      return;
    }

    iframeElWindow.onload = () => {
      if (doc == null) {
        return;
      }

      setStyle(ghGistIframeCss, doc.body);
      iframeEl.style.height = doc.body.scrollHeight + "px";
    };
  });

  while (true) {
    params = yield <iframe ref={ref(iframeRef)} scrolling="no"></iframe>;
  }
});

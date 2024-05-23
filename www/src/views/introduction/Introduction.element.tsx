import { litView } from "@web-companions/lit";

export const introductionElement = litView.element()(function* () {
  while (true) {
    yield (
      <>
        <h5>
          Welcome to the <code>web-companions</code> documentation!
        </h5>
        <p>
          At its core, <code>web-companions</code> is a set of tools to simplify
          the web development process with{" "}
          <b>
            concentration on creating atomic view components using Web
            Specifications
          </b>
          .
        </p>
        <p>
          These libraries are not a framework and not need to learn it
          separately. It's like <code>innerHtml</code>, but with helpers and
          wrappers to make it easier to use Web Specifications and perform
          simple, straightforward tasks:
        </p>
        <ul>
          <li>Write native UI components in a clear way.</li>
          <li>
            No extra knowledge. Learn language, learn specifications and
            platforms.
          </li>
          <li>Without frameworks with minimum of dependencies.</li>
        </ul>

        <hr></hr>
        <h5>A little theory</h5>

        <p>In general, any UI component has two things:</p>
        <ol>
          <li>
            Lifecycle – to control how a component will be created, updated and
            destroyed.
          </li>
          <li>
            Render – to visually present a component in a platform, for web it
            will be HTML, CSS, SVG.
          </li>
        </ol>

        <pre>
          <code>
            {`
<UI Component> = <Lifecycle> + <Render>;

// where:

<Lifecycle> = @web-companions/gfc;

<Render> =  lit-html | uhtml | hyperHTML | @github/jtml | <any other, even innerHTML if you need something very simple>;
            `}
          </code>
        </pre>

        <p>
          To simplify the development process and increase DX we combined
          Lifecycle and Render inside <code>view</code>. A <code>view</code>{" "}
          could be rendered as an HTML element or an HTML node inside an element
          in a web page. Any <code>view</code> is building on two parts:{" "}
          <b>lifecycle and render</b>. In turn, the lifecycle is built on{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator">
            Generator
          </a>{" "}
          and{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components#custom_elements_2">
            Custom elements
          </a>
          . That's all!
        </p>

        <hr></hr>
        <h5>More details</h5>

        <p>
          To use lifecycle convenient way, it was wrapped inside
          <code>@web-companions/gfc</code> package. So that we can just write a
          generator function for <code>EG</code> or <code>NG</code> functions,
          that will use it inside a custom element. Generator function in JS is
          a function that can run it part and return values several times
          without rerun the whole function. We create an infinity part that
          render a new HTML with updated values each time when we produce them.
        </p>

        <img
          alt="Web-companions work schema"
          src="https://raw.githubusercontent.com/sumbad/web-companions/master/doc/schema.png"
          width="100%"
        />

        <p>
          No magic, no compilations, no hacks and hooks. As you can see, it's
          easy to repeat these libraries using JavaScript generator functions
          and Web Specifications.
        </p>
      </>
    );
  }
});

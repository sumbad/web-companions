import { litView } from "@web-companions/lit";

export const getStartedElement = litView.element()(function* () {
  while (true) {
    yield (
      <>
        <p>
          This page will give you an introduction to the way of using{" "}
          <code>web-companions</code> inside some project.
        </p>
        <p>
          Of course, you can use only one library from a list of packages inside{" "}
          <code>web-companions</code> to solve a specific task. But here we will
          show you <b>how to create an atomic component</b> that is the general
          purpose of <code>web-companions</code> set of tools.
        </p>
        <p>
          We will use{" "}
          <a href="https://www.npmjs.com/package/lit-html">lit-html</a> as a{" "}
          <code>render</code> because it's a robust and has a good support
          inside <code>web-companions</code>. Additionally, for better DX, we
          will set up{" "}
          <a href="https://github.com/sumbad/babel-plugin-transform-jsx-to-tt">
            babel-plugin-transform-jsx-to-tt
          </a>
          . This <code>babel</code> plugin allows us to write templates with{" "}
          <code>JSX</code> instead of using Tagged Template Literals directly.
          For demonstration goal, we will use{" "}
          <a href="https://webpack.js.org/">webpack</a>. But of course, you can
          use <code>web-companions</code> without bundling at all. Ok, so let's
          start step by step.
        </p>

        <section>
          <h5>
            1. Create <code>npm</code> project and install <code>webpack</code>{" "}
            and <code>babel</code>:
          </h5>
          <pre>
            Run in terminal next commands
            <code>
              {`
mkdir wc-get-started
cd wc-get-started
npm init -y
npm install webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env babel-plugin-transform-jsx-to-tt --save-dev
              `}
            </code>
          </pre>
        </section>
        <section>
          <h5>2. Set up project:</h5>
          <pre>
            Create <b>webpack.config.js</b> file inside wc-get-started folder
            with next content
            <code>
              {`
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: path.join(__dirname, 'src', 'index.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js(x?)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
              `}
            </code>
            Create <b>.babelrc.json</b> file inside wc-get-started folder with
            next content
            <code>
              {`
{
    "presets": ["@babel/env"],
    "plugins": [
      [
        "babel-plugin-transform-jsx-to-tt",
        {
          "tag": "html",
          "import": {
            "module": "lit-html",
            "export": "html"
          },
          "attributes": [
            {
              "preset": "lit-html"
            }
          ]
        }
      ]
    ]
}  
              `}
            </code>
          </pre>
        </section>
        <section>
          <h5>
            3. Install <code>web-companions</code>
          </h5>
          <pre>
            Run in terminal next commands
            <code>
              {`
npm install @web-companions/lit
              `}
            </code>
          </pre>
        </section>
        <section>
          <h5>
            4. Create your first <code>view component</code>
          </h5>
          <pre>
            Create <b>index.html</b> file inside <b>wc-get-started/src</b>{" "}
            folder with next content
            <code>
              {`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Use web-companions</title>
    <script type="module" src="/index.js"></script></head>
  </head>
  <body>
    <app-main></app-main>
  </body>
</html>
              `}
            </code>
            Create <b>index.jsx</b> file inside <b>wc-get-started/src</b> folder
            with next content
            <code>
              {`
import { litView } from '@web-companions/lit';

litView.element()(function* () {
  let counter = 0;

  while (true) {
    yield (
      <>
        <h1>
          Get started with <code>web-companions</code>
        </h1>

        <p>This is a simple counter, press the next button to increase value</p>

        <button
          onclick={() => {
            counter++, this.next();
          }}
        >
          Add +1
        </button>
        {counter}
      </>
    );
  }
})('app-main');
              `}
            </code>
          </pre>
        </section>

        <section>
          <h5>5. Run project locally:</h5>
          <pre>
            Run in terminal next commands
            <code>
              {`
npx webpack serve
              `}
            </code>
          </pre>
        </section>

        <p>
          Now you can open in a browser url from your terminal. It will show you
          a very simple page with only one button.
        </p>
      </>
    );
  }
});

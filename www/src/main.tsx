import { litView } from '@web-companions/lit';
import { css } from '@web-companions/h/style';

/**
 * ROOT element
 */
litView.element()(function* () {
  while (true) {
    yield (
      <>
        <insum-sidemenu search-placeholder="Поиск">
          <footer
            style={css`
              display: flex;
              height: 100%;
              flex-direction: column;
              justify-content: flex-end;
              padding: 5px;
            `}
          >
            <small>&copy; Copyright 2019, Example Corporation</small>
          </footer>
        </insum-sidemenu>
        <div id="content" style="margin-left: 300px;"></div>
      </>
    );
  }
})('www-main');

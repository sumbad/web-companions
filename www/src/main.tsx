import { litView } from '@web-companions/lit';
import { css } from '@web-companions/h/style';
import { sidemenuElement } from './components/sidemenu/sidemenu.element';


const SidemenuElement = sidemenuElement('demo-sidemenu');


const menu = {
  component: {
    label: 'Компонент',
    category: true,
  },
  style: {
    label: 'Стили',
    available: true,
    category: true,
  },
  tooltip: {
    label: 'Tooltip',
    parent: 'component',
    available: true,
  },
  slider1: {
    label: 'Slider1',
    parent: 'slider',
    available: true,
    hide: true,
  },
  slider_hide: {
    label: 'Slider hide',
    parent: 'slider',
    available: true,
    hide: true,
  },
  slider: {
    label: 'Slider',
  },
  grid: {
    label: 'Grid',
    parent: 'style',
    available: true,
  },
  grid1: {
    label: 'Grid1',
    parent: 'grid',
    available: true,
  },
};

/**
 * ROOT element
 */
litView.element()(function* () {
  while (true) {
    yield (
      <>
        <SidemenuElement searchPlaceholder="Поиск" data={menu} activeMenuItem='component'>
          <footer
            style={css`
              display: flex;
              height: 100%;
              flex-direction: column;
              justify-content: flex-end;
              padding: 5px;
            `}
          >
            <small>&copy; web-companions</small>
          </footer>
        </SidemenuElement>
        <div id="content" style="margin-left: 300px;"></div>
      </>
    );
  }
})('www-main');

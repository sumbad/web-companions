import style from './style.css';
import { EG } from '@web-companions/gfc';
import { render } from 'uhtml';
import type { TypeConstructor } from '@web-companions/gfc/common.model';

export const loadingProgressBarElement = EG({
  props: {
    test: {
      type: String,
      default: undefined,
    },
    config: {
      type: {} as TypeConstructor<{ a: number; b: string }>,
      default: {
        a: 2,
        b: '3',
      },
    },
  },
})(function* ({ config, test = '123' }) {
  let animationName = 'f0';
  let isPause = false;

  const setAnimationName = (frameName: string) => {
    animationName = frameName;

    this.next();
  };

  const generator = function* () {
    yield setAnimationName('f1');
    yield setAnimationName('f2');
    yield setAnimationName('f3');
    yield setAnimationName('f4');
    yield setAnimationName('f5');
    yield setAnimationName('f6');
    yield setAnimationName('f7');
    yield setAnimationName('f8');
    yield setAnimationName('f9');
    yield setAnimationName('f10');
  };

  const handlePause = () => {
    isPause = !isPause;
    this.next();
  };

  this.generateProgress = generator();

  while (true) {
    const props = yield render(
      this,
      <>
        <style>{style}</style>
        <div class={`animated yt-loader ${isPause ? 'pause' : ''}`} style={`animation-name: ${animationName}`}></div>
        <button onclick={handlePause}>Pause</button>
        <div>{config.a}</div>
        <div>{config.b}</div>
        <div>{test}</div>
      </>
    );

    config = props.config;
    test = props.test;
  }
});

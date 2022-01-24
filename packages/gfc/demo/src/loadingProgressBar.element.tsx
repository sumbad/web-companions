import style from './style.css';
import { EG, p } from '@web-companions/gfc';
import { render } from 'lit-html';
import { ComponentFuncThis } from '@web-companions/gfc/@types';

interface LoadingProgressBarElementProps {
  config: {
    a: number;
    b: string;
  };
  test?: string;
}

type LoadingProgressBarElementThis = ComponentFuncThis<LoadingProgressBarElementProps> & {
  generateProgress: Generator<unknown, unknown, unknown>;
};

export const loadingProgressBarElement = EG<LoadingProgressBarElementProps>({
  props: {
    config: p.req(),
    test: p.opt(),
    // ^ the same
    // test: {
    //   type: {} as string,
    //   optional: true,
    // },
  },
})(function* (this: LoadingProgressBarElementThis, { config, test = 'test value' }) {
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
      <>
        <style>{style}</style>
        <div class={`animated yt-loader ${isPause ? 'pause' : ''}`} style={`animation-name: ${animationName}`}></div>
        <button onclick={handlePause}>Pause</button>
        <div>{config.a}</div>
        <div>{config.b}</div>
        <div>{test}</div>
      </>,
      this
    );

    config = props.config;
    test = props.test ?? test;
  }
});

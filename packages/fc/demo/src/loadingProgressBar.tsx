import style from './style.css';
import { EG, useCallback, useEffect, useState } from '@web-companions/fc';
import { render } from 'uhtml';
import type { TypeConstructor } from '@web-companions/fc/common.model';

export const loadingProgressBarEl = EG({
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
  render: (t, n) => render(n, t),
})(function ({ config, test = '123' }) {
  const [animationName, setAnimationName] = useState('f0');
  useEffect(() => {
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

    this.generateProgress = generator();

    console.log('connected loadingProgressBar');
    return () => console.log('disconnected loadingProgressBar');
  }, []);

  const [isPause, setIsPause] = useState(false);

  const handlePause = useCallback(() => {
    setIsPause((_isPause: boolean) => !_isPause);
  }, [setIsPause]);

  return (
    <>
      <style>{style}</style>
      <div class={`animated yt-loader ${isPause ? 'pause' : ''}`} style={`animation-name: ${animationName}`}></div>
      <button onclick={handlePause}>Pause</button>
      <div>{config.a}</div>
      <div>{config.b}</div>
      <div>{test}</div>
    </>
  );
});

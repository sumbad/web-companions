import style from './style.css';
import { useState, useCallback, useEffect } from 'dom-augmentor';
import { FC } from '@web-companions/fc';

export const loadingProgressBar = FC(function () {
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
    </>
  );
});

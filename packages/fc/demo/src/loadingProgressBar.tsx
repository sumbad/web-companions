import style from './style.css';
import { useState, useCallback, useEffect } from 'haunted';
import { FC } from '@web-companions/fc';


export const loadingProgressBar = FC(function (prop: { ref: any }) {
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

    console.log(222, prop.ref);
    prop.ref.current = this ?? {};
    prop.ref.current.generateProgress = generator();
  }, []);

  const [isPause, setIsPause] = useState(false);

  const handlePause = useCallback(() => {
    setIsPause(!isPause);
  }, [isPause]);

  return (
    <>
      <style>{style}</style>
      <div class={`animated yt-loader ${isPause ? 'pause' : ''}`} style={`animation-name: ${animationName}`}></div>
      <button onclick={handlePause}>Pause</button>
    </>
  );
});

// export default loadingProgressBar.element('a-a');

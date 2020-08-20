import style from './style.css';
import { useState, useCallback, useEffect } from 'haunted';

export function loadingProgressBarEl(prop: { ref: any }) {
  const [animationName, setAnimationName] = useState('f0');

  useEffect(() => {
    console.log(this);
    prop.ref.current = this;
    // prop.ref.current.log = (b)=>console.log(b);
    prop.ref.current.generateProgress = function* () {
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
}

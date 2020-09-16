import { FC } from '@web-companions/fc';
import { useEffect, useRef, useState, useCallback } from 'augmentor';
import { loadingProgressBar } from './loadingProgressBar';


const CounterVirtual = FC(
  {
    msg: String,
  },
  (prop) => {
    const [count, setCount] = useState(0);
    
    useEffect(()=>{
      console.log('connected CounterVirtual');
      return () => console.log('disconnected CounterVirtual');
    }, []);

    return (
    <>
        <button type="button" onclick={() => setCount(count + 1)}>
          {prop.msg}
        </button>
        <i>{count}</i>
      </>
    );
  }
).virtual();


const LoadingProgressBarEl = loadingProgressBar.element('loading-progress-bar');

/**
 * ROOT element
 */
FC(() => {
  const myRef = useRef<{ generateProgress?: Generator }>({});

  const handleProgress = useCallback(() => {
    if (myRef.current.generateProgress !== undefined) {
      const r = myRef.current.generateProgress.next();
      console.log(JSON.stringify(r));
    }
  }, []);

  return (
    <>
      <LoadingProgressBarEl ref={myRef}></LoadingProgressBarEl>
      <button onclick={handleProgress}>Progress loading</button>
      <br />
      <br />
      {CounterVirtual({ msg: 'Virtual Counter as Expression' })}
      <br />
      <CounterVirtual msg="Virtual Counter as Element"></CounterVirtual>
    </>
  );
}).element('demo-fc');




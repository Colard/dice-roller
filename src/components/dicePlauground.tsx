import React, {useRef, useState, useEffect} from "react";
import Dice from '../components/Dice'
import Matter from 'matter-js'
import "../styles/dice-playground.css"
 
type DicePlaygroundProps = {
  dicesResaults : number[],
  renderDices : boolean,
}

type UpdateEvent = () => void;

type RefObject<T> = React.MutableRefObject<T | undefined>

const createEngine = () : Matter.Engine => {
  const engine = Matter.Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 0;

  return engine;
}

const createWall = (x : number, y : number, width : number, height : number) : Matter.Body => {
  return Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
}

const createBorders = (windowSize : WindowSize) : Matter.Body[] => {
  const leftWall   = createWall(-250, windowSize.height / 2, 500, windowSize.height);
  const rightWall  = createWall(windowSize.width + 240, windowSize.height / 2, 500, windowSize.height);
  const topWall    = createWall(windowSize.width / 2, -240, windowSize.width, 500);
  const bottomWall = createWall(windowSize.width / 2, windowSize.height + 240, windowSize.width, 500);

  return [leftWall, rightWall, topWall, bottomWall];
}

const animate = (
  engine : Matter.Engine, 
  updateFunctionsRefs : RefObject<UpdateEvent[]>,
  requestRef : RefObject<number>,
  ) => {

  (function rerender() {
    Matter.Engine.update(engine);

    if(updateFunctionsRefs.current) {
      updateFunctionsRefs.current.forEach((updateFunction) => updateFunction());
    }

    requestRef.current = requestAnimationFrame(rerender);
  })();
}


function DicePlayground({dicesResaults, renderDices} : DicePlaygroundProps) : React.ReactElement{
  const requestRef = useRef<number>();
  const engineRef  = useRef<Matter.Engine>(createEngine());
  const updateFunctionsRefs = useRef<UpdateEvent[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = React.useState<WindowSize>({width: 0, height: 0});
  const windowSizeRef = useRef<WindowSize>({width: 0, height: 0});
  React.useLayoutEffect(() => {
    if(!ref.current) return; 
    let newSizes = {
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight
    }

    setWindowSize(newSizes);
    windowSizeRef.current = newSizes
  }, []);
  
  useEffect(() => {
    let resizeTimeoutID: number;

    function handleResize() {
      clearTimeout(resizeTimeoutID);

      resizeTimeoutID = setTimeout(() => {
        if(
          !ref.current ||
          windowSizeRef.current.width == ref.current.offsetWidth && 
          windowSizeRef.current.height == ref.current.offsetWidth
        ) return;

        let newSizes = {
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight
        }

        setWindowSize(newSizes);
        windowSizeRef.current = newSizes
      }, 200);
    }
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutID); 
    };
  }, []);

  useEffect(() => {
    animate(engineRef.current, updateFunctionsRefs, requestRef);
    let walls = createBorders(windowSize);
    Matter.Composite.add(engineRef.current.world, walls);

    return () => {
      if(!requestRef.current) return;
      cancelAnimationFrame(requestRef.current);

      Matter.Engine.clear(engineRef.current);
      Matter.Composite.remove(engineRef.current.world, walls);
    };

  }, [engineRef, windowSize])

  updateFunctionsRefs.current = [];
  return (
    <div className="dice-playground" ref = {ref}>
      {renderDices && dicesResaults.map(
        (el, index) => <Dice
        containerPosition={windowSize}
        updateFunction={(update : UpdateEvent) => updateFunctionsRefs.current.push(update)}
        engine={engineRef} 
        numberArr = {dicesResaults} 
        key={index} 
        number={el}/>
      )
    }
    </div>
  )
} 

export default DicePlayground;
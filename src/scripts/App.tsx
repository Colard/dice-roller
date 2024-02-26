import React from 'react';
import '../styles/global.css'
import { throwDice } from './rollDice';
import DicePlauground from '../components/dicePlauground';

function throwDices(count: number) : number[] {
  let arrOfThrowResaults = [];

  for(let i = 0; i < count; i++) {
    arrOfThrowResaults.push(throwDice());
  }

  return arrOfThrowResaults;
}

function App() {
  const [shouldRenderElement, setShouldRenderElement] = React.useState(false);
  let [throwResaults, setThrowResaults] = React.useState([] as number[]);
  
  const onClickHandler = () => {
    if(!shouldRenderElement) {
      setShouldRenderElement(true);
    }
    setThrowResaults(throwDices(5));
  }

  return (
  <>
    <DicePlauground dicesResaults = {throwResaults} renderDices = {shouldRenderElement} />

    <button onClick={onClickHandler} type="button" id="roll-button">Roll Dices</button>
  </>
  )
}

export default App

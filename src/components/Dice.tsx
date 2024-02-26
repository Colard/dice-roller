import React, { useEffect } from "react"
import styled from "styled-components";
import "../styles/dice.css"
import Matter from "matter-js";
import { generateForce, generateNumber, generatePosition } from "../scripts/rollDice";

type DiceProps = {
  number : number
  numberArr : number[],
  engine? : RefObject<Matter.Engine>,
  updateFunction : (func : () => void) => void
  containerPosition : WindowSize
}

type Box = {
  body: Matter.Body,
  elem?: HTMLDivElement | null,
  render: () => void
}

type DiceSideProps = {
  sideNumber: AvailableDiceNumbers,
}

type DiceConatinerProps = {
  time: number;
}

type RefObject<T> = React.MutableRefObject<T | undefined>

function Dot() {
  return <span className="dot"></span>
}

function DiceSide({sideNumber} : DiceSideProps) {
  return (
    <li className="die-item" data-side={sideNumber}>
      {Array.from({ length: sideNumber }, (_, index) => <Dot key = {index}/>)}
    </li>
  )
}

const DiceConatiner = styled.ol<DiceConatinerProps>`
  transition: transform ${(props)=>props.time}s cubic-bezier(0,.13,.35,.6);
`

function Dice({number, numberArr, engine, updateFunction, containerPosition} : DiceProps) { 
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  let [throwNumber, setThrowNumber]  = React.useState("even-roll");

  let dicePosition = generatePosition(containerPosition);

  const box : Box = {
    body: Matter.Bodies.rectangle(dicePosition.x, dicePosition.y, 64, 64, {
      restitution: 1,
      frictionAir: 0.035
    }),
    render() {
      if(!this.elem) return;
      const {x, y} = this.body.position;
      this.elem.style.top = `${y - 20}px`;
      this.elem.style.left = `${x - 20}px`;
      this.elem.style.transform = `rotate(${this.body.angle}rad)`;
    },
  }

  useEffect(()=> {
    box.elem = boxRef.current
    
    updateFunction(() => box.render());

    if(engine?.current) {
      Matter.Composite.add(engine.current.world, box.body);
    }

    return ()=> {
      if(engine && engine.current) Matter.Composite.remove(engine.current.world, box.body);
    }
  });
  
  useEffect(() => {
    setThrowNumber( throwNumber  == "even-roll" ? "odd-roll" : "even-roll" );
  }, [numberArr])

  useEffect(() => {
    let force = generateForce()
    Matter.Body.applyForce(box.body, box.body.position, {x: force.x, y: force.y})
  }, [throwNumber])

  let animationTime = generateNumber(75, 100) / 100;

  return <div ref={boxRef} className="dice">
    <DiceConatiner time={animationTime} className={`die-list ${throwNumber}`} data-roll={number}>
      {Array.from({ length: 6 }, (_, index) => (
          <DiceSide key={index + 1} sideNumber={index + 1 as AvailableDiceNumbers} />
      ))}
    </DiceConatiner>
  </div>
}

export default Dice;
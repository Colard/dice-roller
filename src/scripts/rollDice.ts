export function generateNumber(min : number, max : number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function throwDice() {
  return generateNumber(1,6);
}

export function generatePosition(container : WindowSize) : {x: number, y: number} {
  
  return {
    x: (container.width / 2 + 100) - generateNumber(0, 200),
    y: (container.height / 2 + 100) - generateNumber(0, 200),
  }
}

export function randomizeDirection(x: number, y: number, deviationPercentage: number = 30): { x: number, y: number } {
  const deviationX: number = (Math.random() * 2 - 1) * deviationPercentage / 100;
  const deviationY: number = (Math.random() * 2 - 1) * deviationPercentage / 100;

  const randomizedX: number = x + deviationX * x;
  const randomizedY: number = y + deviationY * y;

  return { x: randomizedX, y: randomizedY };
}

export function generateForce() : {x: number, y: number} {
  let force = {
    x: generateNumber(30, 50) / 100,
    y: generateNumber(30, 50) / 100,
  }

  return {
    x: generateNumber(0, 1) ? -force.x : force.x,
    y: generateNumber(0, 1) ? -force.y : force.y,
  }
}
const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
// const palettes = require('nice-color-palettes');

// https://www.npmjs.com/package/b-spline
const bSpline = require('b-spline');

random.setSeed(random.getRandomSeed());

const settings = {
  seed: random.getSeed(),
  dimensions: [ 2048, 2048 ],
  pixelsPerInch: 300,
  exportPixelRatio: 2,
};

const sketch = () => {
  // if colors are defined inside the loop we get wilder results
  // const palette = random.pick(palettes)
  // const primaryColor = random.pick(palette)
  // const secondaryColor = random.pick(palette)
  
  return ({ context, width, height }) => {
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)
    const center = {
      x: width / 2,
      y: height / 2
    }
    let rings = random.rangeFloor(75, 150)
    while (rings--) {
      // maybe more chance of changing color/clarity
      // the further away from the center
      const purple = `rgba(148, 0, 211, ${random.value() / 2})`;
      const gold = `rgba(249, 166, 2, ${random.value() / 2})`;
      const radius = randomRadius()
      const points = createSplinePoints(center, radius)
      const [ startX, startY ] = points[0]
      let color = random.value() > .5 ? purple : gold
      if (radius > 100) {
        color = purple
      }
      context.beginPath();
      context.strokeStyle = color
      context.moveTo(startX, startY)
      for (let i = 0; i < points.length - 1; i++) {
        if (i > 100) {
          color = 'red'
        }
        const [ currX, currY ] = points[i]
        const [ nextX, nextY ] = points[i + 1]
        context.moveTo(currX, currY)
        context.lineTo(nextX, nextY)
      }
      context.stroke();
      context.closePath();
    }
  };
};

function randomRadius () {
  return 200 + random.value() * 200 * (random.value() > .5 ? -1 : 1);
}

function createBasePoints (center, radius) {
  const points = []
  const wholeCircle = 2 * Math.PI
  const angleVariation = Math.PI / 20
  for (let angle = 0; angle <= wholeCircle; angle += angleVariation) {
    const pointX = center.x + radius * Math.cos(angle)
    const pointY = center.y + radius * Math.sin(angle)
    const offsetX = random.value() * 20 * (random.value() > .5 ? -1 : 1)
    const offsetY = random.value() * 20 * (random.value() > .5 ? -1 : 1)
    points.push([
      pointX + offsetX,
      pointY + offsetY
    ]);
  }
  return points
}

function createSplinePoints (center, radius) {
  const points = createBasePoints(center, radius)
  const degree = 2;
  const splinePoints = [];
  for (let i = 0; i < 100; i++) {
    splinePoints.push(bSpline(i / 100, degree, points));
  }
  splinePoints.push(splinePoints[0]) // to close the circle
  return splinePoints
}

canvasSketch(sketch, settings);

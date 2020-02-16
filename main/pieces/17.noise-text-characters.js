const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed()); // deterministic randomness

const settings = {
    suffix: `seed${random.getSeed}`,
    dimensions: [ 2048, 2048 ],
    pixelsPerInch: 300,
    exportPixelRatio: 4,
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes))
    .slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 30;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
      const u = count <= 1 ? 0.5 : x / (count - 1); 
      const v = count <= 1 ? 0.5 : y / (count - 1);
      const radius = Math.abs(random.noise2D(u, v)) * 0.04;
      points.push({
          color: random.pick(palette),
          rotation: random.noise2D(u * v, v),
          //radius: random.value() * 0.1,
          //radius: Math.abs(0.01 + random.gaussian() * 0.01),
          radius,
          //radius: Math.max(0, random.gaussian() * 0.01),
          position: [ u, v ]
      });
    }
  }
  return points;
  };

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        color,
        rotation,
        position,
        radius
      } = data;

      const [ u, v ]  = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      const size = random.pick([ 5, 8 ]);

      context.save();
      context.fillStyle = color;
      context.font = `${radius * (width * size)}px "Futura"`;
      //context.font = '50px "Futura"';
      context.translate(x, y);
      context.rotate(rotation); // value or radius
      //context.fillText(random.pick(['😌', '🍆', '🍌']), 0, 0) * 5; // ('_', x, y); 
      context.fillText('+', 0, 0) * 5;
      context.restore();
    });
  }
};

canvasSketch(sketch, settings);
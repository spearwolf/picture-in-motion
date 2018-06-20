
const DEG2RAD = Math.PI / 180.0;

export default (steps, radius = 1) => {
  const halfRadius = 0.5 * radius;
  const delta = 360.0 / steps;
  const arr = [];

  for (let i = 0, deg = 0; i < steps; i++) {
    arr.push([
      halfRadius * Math.sin(deg * DEG2RAD),
      halfRadius * Math.cos(deg * DEG2RAD),
    ]);
    deg += delta;
  }

  return arr;
};

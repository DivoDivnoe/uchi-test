const findArcLength = (radius, alpha) => Math.PI * radius * alpha / 180;

const findRadius = (chordLength, alpha) => {
  const rads = alpha * Math.PI / 180;

  return chordLength / (2 * Math.sin(rads / 2));
};

const findArcHeight = (radius, chordLength) => {
  return radius + 1 - Math.sqrt(radius ** 2 - (chordLength / 2) ** 2);
};

export {findArcLength, findRadius, findArcHeight};

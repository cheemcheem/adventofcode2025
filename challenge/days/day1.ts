import { Day, getInput, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

const getRotation = (input: string) => {
  const rotationPattern = /(L|R)(\d*)/;
  const result = rotationPattern.exec(input);
  if (!result) {
    throw new Error('Input is not a rotation', { cause: input });
  }

  const [_, directionString, distanceString] = result;

  const direction = directionString as 'L' | 'R'; // checked by regex
  const distance = Number(distanceString);

  if (distance < 0) {
    throw new Error('Unexpected distance', { cause: distance });
  }
  return {
    direction,
    distance,
  };
};

const moveDial = (currentPosition: number, rotation: ReturnType<typeof getRotation>) => {
  const sign = rotation.direction === 'L' ? -1 : 1;
  const displacement = (sign * rotation.distance);
  const newPositionRaw = currentPosition + displacement;
  const newTrimmedPosition = newPositionRaw % 100;
  return newTrimmedPosition < 0 ? 100 + newTrimmedPosition : newTrimmedPosition;
};

const moveDialAndCountZeros = (currentPosition: number, rotation: ReturnType<typeof getRotation>) => {
  const sign = rotation.direction === 'L' ? -1 : 1;
  const displacement = (sign * rotation.distance);
  const newPositionRaw = currentPosition + displacement;
  const newTrimmedPosition = newPositionRaw % 100;
  const newPosition = newTrimmedPosition < 0 ? 100 + newTrimmedPosition : newTrimmedPosition;

  // curr newRaw    res
  // a=0  0         0
  // a=0  0>b<=99   0
  // a=0  b>99      b/100
  // a=0  b<0       b/100
  // a>0  0         1
  // a>0  0>b<=99   0
  // a>0  b>99      b/100
  // a>0  b<0       1 + b/100

  const zeroCount
    // went from [1-99] to [0]
    = newPositionRaw === 0 && currentPosition !== 0
      ? 1
      // went from [0-99] to [1 to Infinity]
      : newPositionRaw > 0
        ? Math.floor(newPositionRaw / 100)
        // went from [0-99] to [-Infinity to -1]
        // and add one if starting from [1-99]
        : ((currentPosition === 0 ? 0 : 1) + Math.floor(newPositionRaw / -100));
  // console.log(String(currentPosition).padStart(2, '0'), `${rotation.direction}${String(rotation.distance).padStart(4, '0')}`, String(newPosition).padStart(2, '0'), zeroCount);
  return {
    newPosition,
    zeroCount,
  };
};

const INITIAL_DIAL_POSITION = 50;

const day: Day = {
  part1: async (dayNumber, example) => {
    const inputs = await getInputSplitByLine(dayNumber, example);
    const rotations = inputs.map(getRotation);
    let dialPosition = INITIAL_DIAL_POSITION;
    let zeroCount = 0;
    rotations.forEach((rotation) => {
      dialPosition = moveDial(dialPosition, rotation);
      if (dialPosition === 0) zeroCount++;
    });
    return zeroCount;
  },
  part2: async (dayNumber, example) => {
    const inputs = await getInputSplitByLine(dayNumber, example);
    const rotations = inputs.map(getRotation);
    let dialPosition = INITIAL_DIAL_POSITION;
    let zeroCount = 0;
    rotations.forEach((rotation) => {
      const rotationResult = moveDialAndCountZeros(dialPosition, rotation);
      dialPosition = rotationResult.newPosition;
      zeroCount += rotationResult.zeroCount;
    });
    return zeroCount;
  },
};

export default day;

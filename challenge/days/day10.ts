import { Day, getInputSplitByLine, sumArray } from '@cheemcheem/adventofcode-common';

const extractMachine = (line: string) => {
  const regex = /(\[.*\]) (\(.*\))* ({.*})/;
  const [_, targetIndicatorLightsString, buttonsString, joltageString] = regex.exec(line) ?? [];
  const targetIndicatorLights = targetIndicatorLightsString.replaceAll(/(\[|\])/g, '').split('') as ('#' | '.')[];
  const buttons = buttonsString.split(' ').map(buttonString => buttonString.replaceAll(/(\(|\))/g, '').split(',').map(Number));
  const joltages = joltageString.replaceAll(/(\{|\})/g, '').split(',').map(Number);
  return { targetIndicatorLights, buttons, joltages };
};

const clickButton = (button: readonly number[], currentIndicatorLights: readonly ('#' | '.')[]) => {
  const newIndicatorLights = [...currentIndicatorLights];
  for (const lightIndex of button) {
    newIndicatorLights[lightIndex] = currentIndicatorLights[lightIndex] === '#' ? '.' : '#';
  }
  return newIndicatorLights;
};

const isSolved = (currentIndicatorLights: readonly ('#' | '.')[], targetIndicatorLights: readonly ('#' | '.')[]) => {
  return currentIndicatorLights.every((light, index) => light === targetIndicatorLights[index]);
};

const attemptButtons = (
  buttons: readonly number[][],
  currentIndicatorLights: readonly ('#' | '.')[],
  targetIndicatorLights: readonly ('#' | '.')[],
  seenMap: Map<string, number>,
  iteration = 0,
): number[] => {
  for (const button of buttons) {
    const mapKey = `${currentIndicatorLights.join('')}-${button.join('')}`;
    const seenIteration = seenMap.get(mapKey);
    if (seenIteration !== undefined && seenIteration <= iteration) {
      // console.log('seen      ', currentIndicatorLights, button, iteration, seenIteration);
      return [];
    }

    seenMap.set(mapKey, iteration);
  }

  const newTargetIndicatorLights = buttons.map(button => clickButton(button, currentIndicatorLights));

  for (const newIndicatorLights of newTargetIndicatorLights) {
    // console.log({ button, currentIndicatorLights, newIndicatorLights });
    if (isSolved(newIndicatorLights, targetIndicatorLights)) {
      // console.log('is solved', currentIndicatorLights, button, newIndicatorLights, iteration);
      return [iteration + 1];
    }
  }

  const attempts: number[] = [];

  for (const newIndicatorLights of newTargetIndicatorLights) {
    // console.log('not solved', currentIndicatorLights, button, newIndicatorLights, iteration);
    attempts.push(...attemptButtons(buttons, newIndicatorLights, targetIndicatorLights, seenMap, iteration + 1));
  }

  return attempts;
};

const calculateMachineFewestButtonPresses = ({ buttons, targetIndicatorLights }: ReturnType<typeof extractMachine>) => {
  const initialIndicatorLights = targetIndicatorLights.map(() => '.' as const);

  const buttonPressCounts = attemptButtons(buttons, initialIndicatorLights, targetIndicatorLights, new Map());

  if (buttonPressCounts.length === 0) {
    throw new Error('Not solved');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const minCount = buttonPressCounts.find(a => buttonPressCounts.every(b => a <= b))!;
  console.log({ targetIndicatorLights: targetIndicatorLights.join(''), minCount });

  return minCount;
};

const clickButtonPart2 = (button: readonly number[], currentIndicatorLights: readonly number[]) => {
  const newIndicatorLights = [...currentIndicatorLights];
  for (const lightIndex of button) {
    newIndicatorLights[lightIndex] = currentIndicatorLights[lightIndex] + 1;
  }
  return newIndicatorLights;
};

const isSolvedPart2 = (currentIndicatorLights: readonly number[], targetIndicatorLights: readonly number[]) => {
  return currentIndicatorLights.every((light, index) => light === targetIndicatorLights[index]);
};

const attemptButtonsPart2 = (
  buttons: readonly number[][],
  currentIndicatorLights: readonly number[],
  joltages: readonly number[],
  seenMap: Map<string, number>,
  iteration = 0,
): number[] => {
  // for (const button of buttons) {
  //   const mapKey = `${currentIndicatorLights.join('')}-${button.join('')}`;
  //   const seenIteration = seenMap.get(mapKey);
  //   if (seenIteration !== undefined && seenIteration <= iteration) {
  //     console.log('seen      ', currentIndicatorLights, button, iteration, seenIteration);
  //     return [];
  //   }

  //   seenMap.set(mapKey, iteration);
  // }

  const newIndicatorLightsPerButton = buttons.filter((button) => {
    const mapKey = `${currentIndicatorLights.join('')}-${button.join('')}`;
    const seenIteration = seenMap.get(mapKey);
    if (seenIteration !== undefined && seenIteration <= iteration) {
      // console.log('seen      ', currentIndicatorLights, button, iteration, seenIteration);
      return false;
    }

    seenMap.set(mapKey, iteration);
    return true;
  }).map(button => clickButtonPart2(button, currentIndicatorLights));

  for (const newIndicatorLights of newIndicatorLightsPerButton) {
    // console.log({ currentIndicatorLights, newIndicatorLights });
    if (isSolvedPart2(newIndicatorLights, joltages)) {
      // console.log('is solved', currentIndicatorLights, newIndicatorLights, iteration);
      return [iteration + 1];
    }
  }

  const attempts: number[] = [];

  for (const newIndicatorLights of newIndicatorLightsPerButton) {
    if (newIndicatorLights.some((newLight, index) => newLight > joltages[index])) {
      continue;
    }

    // console.log('not solved', currentIndicatorLights, button, newIndicatorLights, iteration);
    attempts.push(...attemptButtonsPart2(buttons, newIndicatorLights, joltages, seenMap, iteration + 1));
  }

  return attempts;
};

const calculateMachineFewestButtonPressesPart2 = ({ buttons, joltages }: ReturnType<typeof extractMachine>) => {
  const initialIndicatorLights = joltages.map(() => 0 as const);

  const buttonPressCounts = attemptButtonsPart2(buttons, initialIndicatorLights, joltages, new Map());

  if (buttonPressCounts.length === 0) {
    throw new Error('Not solved');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const minCount = buttonPressCounts.find(a => buttonPressCounts.every(b => a <= b))!;
  console.log({ joltages: joltages.join(''), minCount });

  return minCount;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const machines = input.map(extractMachine);
    console.time('Took');
    // const fewestButtonPresses = machines.slice(0, 10).map(calculateMachineFewestButtonPresses);
    const fewestButtonPresses = machines.map(calculateMachineFewestButtonPresses);
    console.timeEnd('Took');
    return sumArray(fewestButtonPresses);
  },
  part2: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const machines = input.map(extractMachine);
    console.time('Took');
    // const fewestButtonPresses = machines.slice(0, 10).map(calculateMachineFewestButtonPresses);
    const fewestButtonPresses = machines.map(calculateMachineFewestButtonPressesPart2);
    console.timeEnd('Took');
    return sumArray(fewestButtonPresses);
  },
};

export default day;

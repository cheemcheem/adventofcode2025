import { Day, DayNumber, getInput, PartNumber, sumArray } from '@cheemcheem/adventofcode-common';

const getRanges = async (dayNumber: DayNumber, example?: PartNumber) => {
  const input = await getInput(dayNumber, example);
  const rangeStrings = input.split(',');
  const ranges = rangeStrings.map((rangeString) => {
    const [from, to] = rangeString.split('-');
    return { from: Number(from), to: Number(to) };
  });
  return ranges;
};

const getInvalidIds = (range: Awaited<ReturnType<typeof getRanges>>[number]) => {
  const invalidIdList: number[] = [];
  for (let currentId = range.from; currentId <= range.to; currentId++) {
    const currentIdString = String(currentId);

    if (currentIdString.length % 2 !== 0) {
      continue;
    }

    const halfCurrentIdString = currentIdString.slice(0, currentIdString.length / 2);
    if (currentIdString === `${halfCurrentIdString}${halfCurrentIdString}`) {
      invalidIdList.push(currentId);
    }
  }
  return invalidIdList;
};

const getInvalidIdsPart2 = (range: Awaited<ReturnType<typeof getRanges>>[number]) => {
  const invalidIdList: number[] = [];
  for (let currentId = range.from; currentId <= range.to; currentId++) {
    const currentIdString = String(currentId);

    for (let currentDivisions = 2; currentDivisions <= currentIdString.length; currentDivisions++) {
      if (currentIdString.length % currentDivisions !== 0) {
        continue;
      }

      const dividedCurrentIdString = currentIdString.slice(0, currentIdString.length / currentDivisions);
      const duplicates = Array.from({ length: currentDivisions }).map(_ => dividedCurrentIdString).reduce((a, b) => a + b);
      if (currentIdString === duplicates) {
        invalidIdList.push(currentId);
        break;
      }
    }
  }
  return invalidIdList;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const ranges = await getRanges(dayNumber, example);
    const invalidIds = ranges.flatMap((range) => {
      const invalidIds = getInvalidIds(range);
      // console.log(range.from, range.to, invalidIds);
      return invalidIds;
    });

    return sumArray(invalidIds);
  },
  part2: async (dayNumber, example) => {
    const ranges = await getRanges(dayNumber, example);
    const invalidIds = ranges.flatMap((range) => {
      const invalidIds = getInvalidIdsPart2(range);
      // console.log(range.from, range.to, invalidIds);
      return invalidIds;
    });

    return sumArray(invalidIds);
  },
};

export default day;

import { Day, getInputSplitByLine, sumArray } from '@cheemcheem/adventofcode-common';

const getBankLargestIndex = (bank: number[]) => {
  const index = bank.findIndex((number, _, array) => {
    return array.every(testNumber => testNumber <= number);
  });
  if (index < 0) {
    throw new Error('index < 0', { cause: { index, bank } });
  }
  return index;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const bankStrings = await getInputSplitByLine(dayNumber, example);
    const bankNumbers = bankStrings.map(bank => bank.split('').map(Number));

    const bankLargestJoltages = bankNumbers.map((bank) => {
      const reducedBank = bank.slice(0, -1);
      const largestIndex = getBankLargestIndex(reducedBank);
      const secondLargestIndex = getBankLargestIndex(bank.slice(largestIndex + 1)) + (largestIndex + 1);
      return Number(`${bank[largestIndex]}${bank[secondLargestIndex]}`);
    });

    return sumArray(bankLargestJoltages);
  },
  part2: async (dayNumber, example) => {
    const bankStrings = await getInputSplitByLine(dayNumber, example);
    const bankNumbers = bankStrings.map(bank => bank.split('').map(Number));

    const bankLargestJoltages = bankNumbers.map((bank) => {
      // console.log({ bank });
      const batteryIndices: number[] = [];

      for (let batteryNumber = 0; batteryNumber < 12; batteryNumber++) {
        const lastBatteryIndex = batteryIndices.at(-1);
        // first run: from 0 -> -12
        // next run: from last indice -> 12 -
        const startIndexOffset = lastBatteryIndex === undefined ? 0 : lastBatteryIndex + 1;
        const endIndexOffset = batteryNumber === 11 ? undefined : -12 + batteryNumber + 1;
        const reducedBank = bank.slice(startIndexOffset, endIndexOffset);

        // console.log({ batteryIndices, indexOffset: startIndexOffset, batteryNumber, reducedBank });
        const largestIndex = getBankLargestIndex(reducedBank);
        // console.log({ largestIndex, largestIndexOffset: largestIndex + startIndexOffset });
        batteryIndices.push(largestIndex + startIndexOffset);
      }

      return Number(batteryIndices.reduce((prev, curr) => `${prev}${bank[curr]}`, ''));
    });

    console.log(bankLargestJoltages);

    return sumArray(bankLargestJoltages);
  },
};

export default day;

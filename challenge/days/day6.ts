import { Day, getInput, getInputSplitByLine, sumArray } from '@cheemcheem/adventofcode-common';

const getColumnIndices = (operations: string) => {
  return operations.matchAll(/(\+|\*)/g).toArray().map(({ index }, currIndex, arr) => ({
    from: index,
    to: currIndex < arr.length - 1
      // remove space
      ? arr[currIndex + 1].index - 1
      : operations.length,
  }));
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const [operations, ...rowsOfNumberStrings] = (input).reverse().map(line => line.split(/\s+/).filter(s => s.length > 0));

    const rowsOfNumbers = rowsOfNumberStrings.map(row => row.map(Number));

    const results = operations.map((operation, index) => {
      return rowsOfNumbers.reduce((prev, curr) => {
        // console.log({ prev, operation, currIndex: curr[index], curr, index });
        switch (operation) {
          case '*': return prev * curr[index];
          case '+': return prev + curr[index];
          default: throw new Error('Whoops');
        }
      }, operation === '*' ? 1 : 0);
    });

    // console.log(results);

    return sumArray(results);
  },
  part2: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const [operations, ...rowsOfNumberStrings] = input.reverse();

    const columnIndices = getColumnIndices(operations);

    // console.log({ operations, rowsOfNumberStrings, columnIndices });

    const results = columnIndices.map(({ from, to }) => {
      const operation = operations.charAt(from);
      const numbers = rowsOfNumberStrings.map(fullRow => fullRow.slice(from, to));

      const columnWidth = to - from;
      // console.log({ columnWidth });
      const rotatedNumbers = Array.from({ length: columnWidth }).map((_, index) => {
        const currentIndex = columnWidth - index - 1;
        const verticaNumber = numbers.map(number => number.charAt(currentIndex)).reduce((prev, curr) => prev + curr);
        // console.log({ verticaNumber });
        return verticaNumber.replaceAll(' ', '').split('').reverse().join('');
      });
      // console.log({ rotatedNumbers, operation });

      const result = rotatedNumbers.map(Number).reduce((prev, curr) => {
        // console.log({ prev, operation, curr });
        switch (operation) {
          case '*': return prev * curr;
          case '+': return prev + curr;
          default: throw new Error('Whoops');
        }
      }, operation === '*' ? 1 : 0);

      // console.log({ result });
      return result;
    });
    return sumArray(results);
  },
};

export default day;

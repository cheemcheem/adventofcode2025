import { Day, getInput, sumArray } from '@cheemcheem/adventofcode-common';
import { EOL } from 'os';

interface Range { from: number; to: number }

const processInput = (input: string) => {
  const [freshIngredientRangesString, availableIngredientsString] = input.split(EOL + EOL);
  const freshIngredientRanges = freshIngredientRangesString.split(EOL).map<Range>((ingredientRangeString) => {
    const [from, to] = ingredientRangeString.split('-');
    return {
      from: Number(from),
      to: Number(to),
    };
  });
  const availableIngredients = availableIngredientsString.split(EOL).map(Number);

  return {
    freshIngredientRanges: freshIngredientRanges.sort((a, b) => {
      const fromSort = a.from - b.from;
      return fromSort === 0 ? a.to - b.to : fromSort;
    }),
    availableIngredients,
  };
};

const isInRange = (ingredientID: number, range: Range) => {
  return ingredientID >= range.from && ingredientID <= range.to;
};

// Exceeds max array length
// const rangeToNumbers = (range: Range) => {
//   const allNumbers = new Array<number>(range.from - range.to);
//   for (let i = range.from; i <= range.to; i++) {
//     allNumbers.push(i);
//   }
//   return allNumbers;
// };

// const findMinMax = (ranges: Range[]) => {
//   let min = ranges[0].from;
//   let max = ranges[0].to;

//   for (let i = 1; i < ranges.length; i++) {
//     min = Math.min(ranges[i].from, min);
//     max = Math.max(ranges[i].to, max);
//   }

//   return {
//     min,
//     max,
//   };
// };

const reduceRanges = (allSortedRanges: readonly Range[]) => {
  const reducedRanges: Range[] = [];
  for (let i = 0; i < allSortedRanges.length; i++) {
    const currentRange: Readonly<Range> = allSortedRanges[i];
    const reducedRange = { ...currentRange };
    for (let j = i + 1; j < allSortedRanges.length; j++) {
      const testRange: Readonly<Range> = allSortedRanges[j];

      if (reducedRange.to >= testRange.from || reducedRange.to === testRange.from - 1) {
        reducedRange.to = testRange.to;
        i = j;
      } else {
        break;
      }
    }
    reducedRanges.push(reducedRange);
  }
  return reducedRanges;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const input = await getInput(dayNumber, example);
    const { availableIngredients, freshIngredientRanges } = processInput(input);
    const freshAvailableIngredients = availableIngredients.filter((availableIngredient) => {
      return freshIngredientRanges.some(range => isInRange(availableIngredient, range));
    });
    return freshAvailableIngredients.length;
  },
  part2: async (dayNumber, example) => {
    const input = await getInput(dayNumber, example);

    const ranges = input.split(EOL + EOL)[0].split(EOL).sort().map((range) => {
      const [from, to] = range.split('-');
      return { from, to };
    });

    console.log(ranges);

    return 0;

    // incorrect
    // const { freshIngredientRanges } = processInput(input);
    // console.log({ freshIngredientRanges: freshIngredientRanges.length });
    // console.log({ invalidRanges: freshIngredientRanges.filter(({ from, to }) => from > to) });
    // console.log({ freshIngredientRanges: freshIngredientRanges.slice(0, 99) });
    // console.log({ freshIngredientRanges: freshIngredientRanges.slice(100) });
    // const reducedRanges = reduceRanges(freshIngredientRanges);
    // console.log({ reducedRanges: reducedRanges.length });
    // console.log({ reducedRanges });
    // console.log(reducedRanges.reduce((previous, current) => previous + `${current.from},${current.to}\n`, ''));
    // return reducedRanges.reduce((previous, current) => previous + (current.to - current.from), reducedRanges.length);
    // return reducedRanges.reduce((previous, current) => previous + (1 + current.to - current.from), 0);
    // return sumArray(reducedRanges.map(range => 1 + range.to - range.from));
    // return reducedRanges.length + sumArray(reducedRanges.map(range => range.to - range.from));

    // too slow
    // const { min, max } = findMinMax(reducedRanges);
    // console.log({ min, max });
    // let count = 0;
    // for (let i = min; i <= max; i++) {
    //   // const percent = 100 * (i - min) / (max - min);
    //   // console.log('processing %d of %d to %d (%d\\%)', i, min, max, percent);
    //   if (reducedRanges.some(range => isInRange(i, range))) {
    //     count++;
    //   }
    // }
    // return count;
  },
};

export default day;

// min: 56948495394, max: 561913324453432

// too low:   332385323899380
// incorrect: 356197743135182

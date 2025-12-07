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

const mergeRanges = (allSortedRanges: readonly Readonly<Range>[]) => {
  const reducedRanges: Range[] = [];
  for (let i = 0; i < allSortedRanges.length;) {
    const mergedRange = { ...allSortedRanges[i] };
    while (i < allSortedRanges.length) {
      const nextRange = allSortedRanges[i];

      // () = merged range
      // [] = next range

      // handle ([])
      if (mergedRange.from <= nextRange.from && mergedRange.to >= nextRange.to) {
        i++;
        continue;
      }

      // handle ( [) ] and ()[]
      if ((mergedRange.to >= nextRange.from && mergedRange.from <= nextRange.from) || mergedRange.to === nextRange.from - 1) {
        mergedRange.to = nextRange.to;
        i++;
        continue;
      }

      break;
    }
    reducedRanges.push(mergedRange);
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

    const { freshIngredientRanges } = processInput(input);
    console.log({ freshIngredientRanges: freshIngredientRanges.length });
    console.log({ invalidRanges: freshIngredientRanges.filter(({ from, to }) => from > to) });
    // console.log({ freshIngredientRanges: freshIngredientRanges.slice(0, 99) });
    // console.log({ freshIngredientRanges: freshIngredientRanges.slice(100) });
    const mergedRanges = mergeRanges(freshIngredientRanges);
    console.log({ reducedRanges: mergedRanges.length });
    // console.log({ reducedRanges });
    // console.log(reducedRanges.reduce((previous, current) => previous + `${current.from},${current.to}\n`, ''));
    return mergedRanges.reduce((previous, current) => previous + (current.to - current.from), mergedRanges.length);
    // return reducedRanges.reduce((previous, current) => previous + (1 + current.to - current.from), 0);
    // return sumArray(reducedRanges.map(range => 1 + range.to - range.from));
    // return reducedRanges.length + sumArray(reducedRanges.map(range => range.to - range.from));
  },
};

export default day;

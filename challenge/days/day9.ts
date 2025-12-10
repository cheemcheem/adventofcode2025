import { createGrid, Day, getInput, getInputSplitByLine, inputAsGrid, positionEquals } from '@cheemcheem/adventofcode-common';

const day: Day = {
  part1: async (dayNumber, example) => {
    const coordStrings = await getInputSplitByLine(dayNumber, example);
    const coords = coordStrings.map((coordString) => {
      const [x, y] = coordString.split(',').map(Number);
      return { x, y };
    });
    // const gridSize = coords.reduce((a, b) => ({
    //   x: a.x > b.x ? a.x : b.x,
    //   y: a.y > b.y ? a.y : b.y,
    // }));
    // const grid = createGrid();
    const maxAreas = coords.map((a, index, array) => {
      if (index === array.length - 1) {
        return 0;
      }
      const areas = array.slice(index + 1).map(b => (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1)).sort((a, b) => b - a);
      // console.log({ areas });

      return areas[0];
    }).sort((a, b) => b - a);
    // console.log({ maxAreas });

    return maxAreas[0];
  },
  part2: async (dayNumber, example) => {
    return 0;
  },
};

export default day;

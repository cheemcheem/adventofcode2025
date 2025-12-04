import { Day, getInput, getInputSplitByLine, Grid, inputAsGrid, logGrid, searchNearby } from '@cheemcheem/adventofcode-common';

const PAPER = '@';

type PaperGridPieces = '.' | '@'; ;

const getAccessiblePositions = (grid: Grid<PaperGridPieces>) => {
  return grid.flatMap((row, rowIndex) => {
    const rowWithPositions = row.map((value, colIndex) => ({ value, colIndex, rowIndex }));
    const filteredPositions = rowWithPositions.filter(({ value, colIndex, rowIndex }) => {
      if (value !== PAPER) {
        return false;
      }

      const paperNearbyCount = searchNearby({ grid, diagonal: true, position: { colIndex, rowIndex }, searchItems: [PAPER] }).length;
      return paperNearbyCount < 4;
    });

    return filteredPositions;
  });
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const grid = inputAsGrid<PaperGridPieces>(input, ['.', PAPER]);
    const accessiblePositions = getAccessiblePositions(grid);
    // console.log(accessiblePositions);
    return accessiblePositions.length;
  },
  part2: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const grid = inputAsGrid<PaperGridPieces>(input, ['.', PAPER]);

    let paperCount = 0;
    for (let accessiblePositions = getAccessiblePositions(grid); accessiblePositions.length > 0; accessiblePositions = getAccessiblePositions(grid)) {
      // logGrid(grid);
      paperCount += accessiblePositions.length;
      accessiblePositions.forEach(({ colIndex, rowIndex }) => {
        grid[rowIndex][colIndex] = '.';
      });
    }
    return paperCount;
  },
};

export default day;

import { Day, getInput, getInputSplitByLine, inputAsGrid, sumArray } from '@cheemcheem/adventofcode-common';

const splitBeams = (beamIndices: number[], line: string) => {
  return Array.from(new Set(beamIndices.flatMap((beamIndex) => {
    const lineItem = line.charAt(beamIndex);
    if (lineItem === '.') {
      return [beamIndex];
    }

    if (lineItem === '^') {
      return [beamIndex - 1, beamIndex + 1].filter(newBeamIndex => newBeamIndex >= 0 && newBeamIndex < line.length);
    }

    throw new Error('Whoops');
  })));
};

const countTimelines = (beamIndex: number, lines: string[], currentLineIndex = 0): number => {
  if (currentLineIndex >= lines.length) {
    // console.log('reached end', beamIndex);
    return 1;
  }

  const currentLine = lines[currentLineIndex];

  // unchanged beams
  const isUnchangedBeam = currentLine.charAt(beamIndex) === '.';
  if (isUnchangedBeam) {
    return countTimelines(beamIndex, lines, currentLineIndex + 1);
  }

  // changed beams
  // const changedBeams = [beamIndex - 1, beamIndex + 1].filter(newBeamIndex => newBeamIndex >= 0 && newBeamIndex < currentLine.length);
  // const changedBeamTimelines = changedBeams.map(changedBeamIndex => countTimelines(changedBeamIndex, lines, currentLineIndex + 1));
  // return sumArray(changedBeamTimelines);
  return countTimelines(beamIndex + 1, lines, currentLineIndex + 1) + countTimelines(beamIndex - 1, lines, currentLineIndex + 1);
};

const splitBeamsNotUnique = (beamIndices: number[], line: string) => {
  const splits = beamIndices.flatMap((beamIndex) => {
    const lineItem = line.charAt(beamIndex);
    if (lineItem === '.') {
      return [beamIndex];
    }

    if (lineItem === '^') {
      return [beamIndex - 1, beamIndex + 1].filter(newBeamIndex => newBeamIndex >= 0 && newBeamIndex < line.length);
    }

    throw new Error('Whoops');
  });

  return splits.reduce((acc, curr) => {
    const prevCount = acc.get(curr) ?? 0;
    acc.set(curr, prevCount + 1);
    return acc;
  }, new Map<number, number>());
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const [startingLine, ...splitterLines] = await getInputSplitByLine(dayNumber, example);
    const firstIndex = startingLine.indexOf('S');
    const finalLineBeamIndices = splitterLines.reduce((prev, curr) => {
      const currentLineBeams = splitBeams(prev.beams, curr);
      const newSplits = prev.beams.filter(beamIndex => curr.charAt(beamIndex) === '^').length;
      // console.log({ prev, curr, newSplits });
      return {
        beams: currentLineBeams,
        splits: prev.splits + newSplits,
      };
    }, { beams: [firstIndex], splits: 0 });
    return finalLineBeamIndices.splits;
  },
  part2: async (dayNumber, example) => {
    const [startingLine, ...splitterLines] = await getInputSplitByLine(dayNumber, example);
    const firstIndex = startingLine.indexOf('S');

    let runningLineBeamCounts = new Map([[firstIndex, 1]]);
    for (const line of splitterLines) {
      // for each index in running map
      // -> split index to new indices with same count
      // -> insert new indices into new map
      // replace running map with new map
      const currentLineBeamCounts = new Map<number, number>();
      for (const [beamIndex, count] of runningLineBeamCounts) {
        const lineItem = line.charAt(beamIndex);
        if (lineItem === '.') {
          const currentCount = (currentLineBeamCounts.get(beamIndex) ?? 0) + count;
          currentLineBeamCounts.set(beamIndex, currentCount);
          continue;
        }

        if (lineItem === '^') {
          const leftIndex = beamIndex - 1;
          const leftCount = (currentLineBeamCounts.get(leftIndex) ?? 0) + count;
          currentLineBeamCounts.set(leftIndex, leftCount);

          const rightIndex = beamIndex + 1;
          const rightCount = (currentLineBeamCounts.get(rightIndex) ?? 0) + count;
          currentLineBeamCounts.set(rightIndex, rightCount);
          continue;
        }
        throw new Error('Whoops');
      }
      // console.log({ line, currentLineBeamCounts });
      runningLineBeamCounts = currentLineBeamCounts;
    }

    // console.log({ runningLineBeamCounts });
    return runningLineBeamCounts.entries().reduce((prev, curr) => prev + curr[1], 0);
  },
};

export default day;

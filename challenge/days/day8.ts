import { Day, getInputSplitByLine, multiplyArray, sumArray } from '@cheemcheem/adventofcode-common';

interface Vector {
  x: number;
  y: number;
  z: number;
}

const calculateDistanceBetween = (vector1: Vector, vector2: Vector) => {
  return Math.sqrt(
    Math.pow((vector1.x - vector2.x), 2)
    + Math.pow((vector1.y - vector2.y), 2)
    + Math.pow((vector1.z - vector2.z), 2),
  );
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const vectors = input.map<Readonly<Vector>>((vectorString) => {
      const [x, y, z] = vectorString.split(',').map(Number);
      return { x, y, z };
    });
    // console.log({ vectors });
    // console.log(calculateDistanceBetween({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }));
    const closenessGrid = vectors.map((vector, index) => {
      const sortedFutureVectors = vectors.slice(index + 1).map(futureVector => ({
        futureVector,
        distance: calculateDistanceBetween(futureVector, vector),
      }));
      return {
        vector,
        sortedFutureVectors,
      };
    }).flatMap(({ vector, sortedFutureVectors }) => {
      return sortedFutureVectors.map(({ futureVector, distance }) => ({
        vectorA: vector,
        vectorB: futureVector,
        distance,
      }));
    }).sort((first, second) => {
      // sort by distance
      const distanceDiff = first.distance - second.distance;
      if (distanceDiff !== 0) {
        return distanceDiff;
      }
      throw new Error('Distance same', { cause: { first, second } });
    });

    // closenessGrid.forEach((closeness) => {
    //   console.log({ closeness });
    // });

    const circuits: Readonly<Vector>[][] = vectors.map(vector => [vector]);

    let connectionCount = 0;
    for (const { distance, vectorA, vectorB } of closenessGrid) {
      const previousCircuitA = circuits.find(circuit => circuit.some(vector => vector === vectorA));
      const previousCircuitB = circuits.find(circuit => circuit.some(vector => vector === vectorB));
      const MAX_CONNECTIONS = example ? 10 : 1000;
      // console.log({ connectionCount, circuitsLength: circuits.length });
      // if (connectionCount <= MAX_CONNECTIONS) {
      //   console.log({ vectorA, vectorB });
      //   circuits.forEach((circuit, index) => {
      //     console.log({ [`circuit${index}`]: circuit });
      //   });
      // }

      if (connectionCount >= MAX_CONNECTIONS) {
        break;
      }
      // if neither in circuit, create new circuit
      if (!previousCircuitA && !previousCircuitB) {
        circuits.push([vectorA, vectorB]);
        connectionCount++;
        continue;
      }

      // if a in circuit, add b to same circuit
      if (previousCircuitA && !previousCircuitB) {
        previousCircuitA.push(vectorB);
        connectionCount++;
        continue;
      }

      // if b in circuit, add a to same circuit
      if (previousCircuitB && !previousCircuitA) {
        previousCircuitB.push(vectorA);
        connectionCount++;
        continue;
      }

      if (!previousCircuitA || !previousCircuitB) {
        throw new Error('Both are undefined.');
      }

      // if a and b in same circuit continue
      if (previousCircuitA === previousCircuitB) {
        connectionCount++;
        continue;
      }

      // if a and b in different circuits, bridge
      if (previousCircuitA !== previousCircuitB) {
        circuits.splice(circuits.indexOf(previousCircuitA), 1);
        circuits.splice(circuits.indexOf(previousCircuitB), 1);
        circuits.push([...previousCircuitA, ...previousCircuitB]);
        connectionCount++;
      }
    }

    // circuits.forEach((circuit) => {
    //   console.log({ circuit });
    // });

    // circuits.forEach((circuitA, index) => {
    //   // console.log({ circuit: circuitA });
    //   circuits.slice(index + 1).forEach((circuitB) => {
    //     if (circuitA.some(vectorA => circuitB.includes(vectorA))) {
    //       console.error({ circuitA });
    //       console.error({ circuitB });
    //       throw new Error('Vector in 2 circuits');
    //     }
    //   });
    // });

    return multiplyArray(circuits.sort((a, b) => b.length - a.length).slice(0, 3).map(circuit => circuit.length));
  },
  part2: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);
    const vectors = input.map<Readonly<Vector>>((vectorString) => {
      const [x, y, z] = vectorString.split(',').map(Number);
      return { x, y, z };
    });
    // console.log({ vectors });
    // console.log(calculateDistanceBetween({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }));
    const closenessGrid = vectors.map((vector, index) => {
      const sortedFutureVectors = vectors.slice(index + 1).map(futureVector => ({
        futureVector,
        distance: calculateDistanceBetween(futureVector, vector),
      }));
      return {
        vector,
        sortedFutureVectors,
      };
    }).flatMap(({ vector, sortedFutureVectors }) => {
      return sortedFutureVectors.map(({ futureVector, distance }) => ({
        vectorA: vector,
        vectorB: futureVector,
        distance,
      }));
    }).sort((first, second) => {
      // sort by distance
      const distanceDiff = first.distance - second.distance;
      if (distanceDiff !== 0) {
        return distanceDiff;
      }
      throw new Error('Distance same', { cause: { first, second } });
    });

    // closenessGrid.forEach((closeness) => {
    //   console.log({ closeness });
    // });

    const circuits: Readonly<Vector>[][] = vectors.map(vector => [vector]);

    let lastConnection: {
      vectorA: Readonly<Vector>;
      vectorB: Readonly<Vector>;
      distance: number;
    } | undefined = undefined;
    for (const { distance, vectorA, vectorB } of closenessGrid) {
      const previousCircuitA = circuits.find(circuit => circuit.some(vector => vector === vectorA));
      const previousCircuitB = circuits.find(circuit => circuit.some(vector => vector === vectorB));
      const MAX_CONNECTIONS = example ? 10 : 1000;
      // console.log({ connectionCount, circuitsLength: circuits.length });
      // if (connectionCount <= MAX_CONNECTIONS) {
      //   console.log({ vectorA, vectorB });
      //   circuits.forEach((circuit, index) => {
      //     console.log({ [`circuit${index}`]: circuit });
      //   });
      // }

      // if (connectionCount >= MAX_CONNECTIONS) {
      //   break;
      // }
      // if neither in circuit, create new circuit
      if (!previousCircuitA && !previousCircuitB) {
        circuits.push([vectorA, vectorB]);
        lastConnection = { vectorA, vectorB, distance };
        continue;
      }

      // if a in circuit, add b to same circuit
      if (previousCircuitA && !previousCircuitB) {
        previousCircuitA.push(vectorB);
        lastConnection = { vectorA, vectorB, distance };
        continue;
      }

      // if b in circuit, add a to same circuit
      if (previousCircuitB && !previousCircuitA) {
        previousCircuitB.push(vectorA);
        lastConnection = { vectorA, vectorB, distance };
        continue;
      }

      if (!previousCircuitA || !previousCircuitB) {
        throw new Error('Both are undefined.');
      }

      // if a and b in same circuit continue
      if (previousCircuitA === previousCircuitB) {
        // lastConnection = { vectorA, vectorB, distance };
        continue;
      }

      // if a and b in different circuits, bridge
      if (previousCircuitA !== previousCircuitB) {
        circuits.splice(circuits.indexOf(previousCircuitA), 1);
        circuits.splice(circuits.indexOf(previousCircuitB), 1);
        circuits.push([...previousCircuitA, ...previousCircuitB]);
        lastConnection = { vectorA, vectorB, distance };
      }
    }

    // circuits.forEach((circuit) => {
    //   console.log({ circuit });
    // });

    // circuits.forEach((circuitA, index) => {
    //   // console.log({ circuit: circuitA });
    //   circuits.slice(index + 1).forEach((circuitB) => {
    //     if (circuitA.some(vectorA => circuitB.includes(vectorA))) {
    //       console.error({ circuitA });
    //       console.error({ circuitB });
    //       throw new Error('Vector in 2 circuits');
    //     }
    //   });
    // });

    console.log({ lastConnection });
    if (!lastConnection) {
      throw new Error('Missing last connection');
    }
    return lastConnection.vectorA.x * lastConnection.vectorB.x;
  },
};

export default day;

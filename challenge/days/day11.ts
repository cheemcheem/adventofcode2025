import { Day, getInputSplitByLine, sumArray } from '@cheemcheem/adventofcode-common';

interface Node {
  name: string;
  connections: Node[];
}

const getNodeStrings = (line: string) => {
  const [name, connectingNodeNamesString] = line.split(': ');
  const connectingNodeNames = connectingNodeNamesString.split(' ');
  return {
    name,
    connectingNodeNames,
  };
};

const countPathsToOut = (currentNode: Node): number => {
  if (currentNode.name === 'out') {
    return 1;
  }

  const countOfPathsToOut = currentNode.connections.map(countPathsToOut);

  return sumArray(countOfPathsToOut);
};

const getPathsToOut = (currentNode: Node, previousPath = '', hasPassedDac = false, hasPassedFft = false): string[] => {
  const currentPath = `${previousPath},${currentNode.name}`;
  if (currentNode.name === 'out') {
    if (hasPassedDac && hasPassedFft) {
      console.log({ pathOut: [currentPath] });
    }
    return hasPassedDac && hasPassedFft ? [currentPath] : [];
  }

  if (currentNode.name === 'dac') {
    hasPassedDac = true;
  }

  if (currentNode.name === 'fft') {
    hasPassedFft = true;
  }
 
  const pathsToOut = currentNode.connections.flatMap((connectingNode) => {
    return getPathsToOut(connectingNode, currentPath, hasPassedDac, hasPassedFft);
  });

  return pathsToOut;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const lines = await getInputSplitByLine(dayNumber, example);
    const nodeStrings = lines.map(getNodeStrings);
    const nodeMap = new Map<string, Node>();
    const nodes = nodeStrings.map(({ connectingNodeNames, name }) => {
      const node = nodeMap.get(name) ?? { connections: [], name };

      const connectingNodes = connectingNodeNames.map((connectingNodeName) => {
        const connectingNode = nodeMap.get(connectingNodeName) ?? { connections: [], name: connectingNodeName };
        nodeMap.set(connectingNodeName, connectingNode);
        return connectingNode;
      });
      node.connections = [...node.connections, ...connectingNodes];

      nodeMap.set(name, node);

      return node;
    });

    // nodes.forEach(({ name, connections }) => {
    //   console.log({ name, connections });
    // });
    // nodeMap.forEach(({ name, connections }) => {
    //   console.log({ name, connections });
    // });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const startNode = nodeMap.get('you')!;
    const countOfPathsToOut = countPathsToOut(startNode);
    return countOfPathsToOut;
  },
  part2: async (dayNumber, example) => {
    const lines = await getInputSplitByLine(dayNumber, example);
    const nodeStrings = lines.map(getNodeStrings);
    const nodeMap = new Map<string, Node>();
    const nodes = nodeStrings.map(({ connectingNodeNames, name }) => {
      const node = nodeMap.get(name) ?? { connections: [], name };

      const connectingNodes = connectingNodeNames.map((connectingNodeName) => {
        const connectingNode = nodeMap.get(connectingNodeName) ?? { connections: [], name: connectingNodeName };
        nodeMap.set(connectingNodeName, connectingNode);
        return connectingNode;
      });

      node.connections = [...node.connections, ...connectingNodes];

      nodeMap.set(name, node);

      return node;
    });

    // nodes.forEach(({ name, connections }) => {
    //   console.log({ name, connections });
    // });
    // nodeMap.forEach(({ name, connections }) => {
    //   console.log({ name, connections });
    // });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const startNode = nodeMap.get('svr')!;
    const seenMap = new Map<string, number>();
    const pathsToOut = getPathsToOut(startNode);
    console.log({ pathsToOut });
    return 0;
  },
};

export default day;

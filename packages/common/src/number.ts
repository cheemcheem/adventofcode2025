export const sumArray = (array: (number[])) => array.reduce((prev, curr) => prev + curr, 0);
export const multiplyArray = (array: (number[])) => array.reduce((prev, curr) => prev * curr, 1);
export const sumBigIntArray = (array: (bigint[])) => array.reduce((prev, curr) => prev + curr, BigInt(0));

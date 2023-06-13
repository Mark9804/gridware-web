/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
function getOccupiedCount(targetX, targetY, xCellCount, yCellCount, dataset) {
  let count = 0;
  for (let i = 0; i < dataset.length; i++) {
    const { x, y } = dataset[i];
    const xOriginal = x / 40;
    const yOriginal = y / 40;
    if (
      xOriginal - targetX < 1 &&
      xOriginal - targetX > 0 &&
      yCellCount - yOriginal - targetY < 1 &&
      yCellCount - yOriginal - targetY > 0
    ) {
      count++;
    }
  }
  return count;
}

function getCellHeterogeneity(
  durationCount: number,
  occupiedCellsList: { x: number; y: number; count: number }[],
  x: number,
  y: number
) {
  if (durationCount === 0) {
    return -1;
  }
  const observedCount = durationCount;
  let allCounts = 0;
  const occupiedCellsCount = occupiedCellsList.length;
  for (let i = 0; i < occupiedCellsList.length; i++) {
    allCounts += occupiedCellsList[i].count;
  }
  const expected = allCounts / occupiedCellsCount;
  const heterogeneity =
    Math.floor(
      ((observedCount - expected) ** 2 / (expected * occupiedCellsCount)) * 100
    ) / 100;

  const allCountsAfterNodeRemoval = allCounts - observedCount;
  const occupiedCellsCountAfterNodeRemoval = occupiedCellsCount - 1;

  if (allCountsAfterNodeRemoval === 0) {
    return heterogeneity;
  }
  const expectedAfterNodeRemoval =
    allCounts / occupiedCellsCountAfterNodeRemoval;

  const occupiedCellsListAfterNodeRemoval = occupiedCellsList.filter(
    cell => !(cell.x === x && cell.y === y)
  );

  let sumSquare = 0;

  for (let i = 0; i < occupiedCellsListAfterNodeRemoval.length; i++) {
    sumSquare +=
      (occupiedCellsListAfterNodeRemoval[i].count - expectedAfterNodeRemoval) **
      2;
  }

  return (
    sumSquare / (expectedAfterNodeRemoval * occupiedCellsCountAfterNodeRemoval)
  );
  return heterogeneity;
}

export { getOccupiedCount, getCellHeterogeneity };

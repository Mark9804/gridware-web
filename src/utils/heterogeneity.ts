/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { numberAnimationProps } from 'naive-ui';
import { OccupiedCell } from '@types/AnalysisGroups';

function getOccupiedCount(
  targetX: number,
  targetY: number,
  xCellCount: number,
  yCellCount: number,
  dataset: Array<{ x: number; y: number; count: number }>
) {
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

function getHeterogeneityScore(cellsList: OccupiedCell[]): number | undefined {
  const eventCount = cellsList.reduce(
    (acc: number, cur, OccupiedCell) => acc + cur.count,
    0
  ) as number;
  const cellsCount = cellsList.length;

  const expected = eventCount / cellsCount;

  const heterogeneitySum = cellsList.reduce(
    (acc: number, cur: OccupiedCell) => {
      return acc + Math.pow(cur.count - expected, 2) / expected;
    },
    0
  );

  return (heterogeneitySum / cellsCount).toFixed(2) * 1 ?? undefined;
}

export { getOccupiedCount, getHeterogeneityScore };

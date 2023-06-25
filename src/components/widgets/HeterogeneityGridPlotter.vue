<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { OccupiedCell } from '@types/AnalysisGroups';
import { getCellHeterogeneity, getOccupiedCount } from '@utils/heterogeneity';

const emits = defineEmits<{
  (event: 'update:occupiedCells', occupiedCellsList: OccupiedCell[]): void;
}>();

const props = defineProps({
  yCellCount: {
    type: Number,
    required: true,
  },
  xCellCount: {
    type: Number,
    required: true,
  },
  occupiedCells: {
    type: Array as PropType<{ x: number; y: number; count: number }[]>,
    required: true,
  },
  nodes: {
    // @ts-ignore
    type: Object as PropType<any>,
    required: true,
  },
});

const occupiedCellsList = ref<OccupiedCell[]>([]);

watch(
  () => props.occupiedCells,
  () => {
    occupiedCellsList.value = [];
  }
);

function handleCountOccupied(x: number, y: number) {
  const occupiedCount = getOccupiedCount(
    x,
    y,
    props.xCellCount,
    props.yCellCount,
    props.nodes
  );
  if (occupiedCount > 0) {
    // if cell not in occupied cells list, add it
    if (
      occupiedCellsList.value.filter(i => i.x === x && i.y === y).length === 0
    ) {
      occupiedCellsList.value.push({ x, y, count: occupiedCount });
    }
    const tempOccupiedCellsList = occupiedCellsList.value.sort((a, b) => {
      if (a.count !== b.count) {
        return a.count - b.count;
      } else {
        if (a.x !== b.x) {
          return a.x - b.x;
        } else {
          return a.y - b.y;
        }
      }
    });

    for (let i = 0; i < tempOccupiedCellsList.length; i++) {
      const currentCell = tempOccupiedCellsList[i];
      currentCell.order = i;
      tempOccupiedCellsList[i] = currentCell;
    }

    occupiedCellsList.value = tempOccupiedCellsList;

    return tempOccupiedCellsList.find(i => i.x === x && i.y === y)?.order;
  } else {
    // if no event happened in this cell, then the event count is 0
    return -1;
  }
}

watch(
  () => occupiedCellsList.value,
  () => {
    emits('update:occupiedCells', occupiedCellsList.value);
  }
);
</script>

<template>
  <div class="heterogeneity__container">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <tbody>
        <tr v-for="yCount in props.yCellCount">
          <td
            class="border dark:bg-gray-800 dark:border-gray-700 table-cell"
            v-for="xCount in props.xCellCount"
          >
            {{
              -1 !== handleCountOccupied(xCount - 1, props.yCellCount - yCount)
                ? `#${handleCountOccupied(
                    xCount - 1,
                    props.yCellCount - yCount
                  )}`
                : ''
            }}
          </td>
        </tr>
      </tbody>
    </table>
    Heterogeneity
  </div>
</template>

<style scoped lang="scss">
table .table-cell {
  width: 40px;
  height: 40px;
  text-align: center;
}
</style>

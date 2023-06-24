<script setup lang="ts">
import { PropType } from 'vue';
import { getCellHeterogeneity, getOccupiedCount } from '@utils/heterogeneity';

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
    type: Object as PropType<any>,
    required: true,
  },
});

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
    if (props.occupiedCells.filter(i => i.x === x && i.y === y).length === 0) {
      props.occupiedCells.push({ x, y, count: occupiedCount });
    }
    return occupiedCount;
  } else {
    return 0;
  }
}
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
            {{ handleCountOccupied(xCount - 1, props.yCellCount - yCount) }}
            <!--          {{-->
            <!--            handleCountOccupied(-->
            <!--              xCount - 1,-->
            <!--              props.yCellCount - yCount-->
            <!--            ) !== 0-->
            <!--              ? getCellHeterogeneity(-->
            <!--                handleCountOccupied(-->
            <!--                  xCount - 1,-->
            <!--                  props.yCellCount - yCount-->
            <!--                ),-->
            <!--                occupiedCells,-->
            <!--                xCount - 1,-->
            <!--                props.yCellCount - yCount-->
            <!--              ).toFixed(2)-->
            <!--              : ''-->
            <!--          }}-->
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

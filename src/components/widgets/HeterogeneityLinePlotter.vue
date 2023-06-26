<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Line } from '@antv/g2plot';
import { OccupiedCell } from '@types/AnalysisGroups';
import { getHeterogeneityScore } from '@utils/heterogeneity';

const props = defineProps<{
  occupiedCellsList: OccupiedCell[];
}>();

// type OccupiedCell = {
//   order: number;
//   x: number;
//   y: number;
//   count: number;
// };

const cellsList = computed(() => props.occupiedCellsList);

const heterogeneityScoreSet = ref<number[]>([]);

const testSet = ref([
  { count: 2 },
  { count: 2 },
  { count: 3 },
  { count: 4 },
  { count: 20 },
  { count: 30 },
]);

watch(
  () => props.occupiedCellsList,
  () => {
    heterogeneityScoreSet.value = [];
    const pointSet = cellsList.value;
    for (let i = 0; i < pointSet.length; i++) {
      // delete first i elements
      const tempCellsList = pointSet.slice(i);
      heterogeneityScoreSet.value.push(getHeterogeneityScore(tempCellsList));
    }
  }
);

const heterogeneityScoreData = computed(() => {
  const initialHeterogeneityValue = heterogeneityScoreSet.value[0];

  return heterogeneityScoreSet.value.map((value, index) => {
    if (0 === index) {
      if (0 === value) {
        return {
          index: '1',
          heterogeneity: 0,
        };
      }
    }
    return {
      index: (index + 1).toString(),
      heterogeneity:
        Math.floor((100 * value) / initialHeterogeneityValue) / 100 || 0,
    };
  });
});

onMounted(() => {
  const line = new Line('heterogeneity-line', {
    data: heterogeneityScoreData.value,
    // autoFit: true,
    height: 220,
    width: 400,
    animation: false,
    xField: 'index',
    yField: 'heterogeneity',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: { showMarkers: false },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [{ type: 'marker-active' }],
  });

  line.render();

  watch(
    () => heterogeneityScoreData.value,
    newValue => {
      line.changeData(newValue);
    }
  );
});
</script>

<template>
  <div class="heterogeneity-line-container">
    <!--    {{ heterogeneityScoreSet }}<br>-->
    <!--    {{ heterogeneityScoreData }}-->
    <div id="heterogeneity-line"></div>
    <div>Heterogeneity</div>
  </div>
</template>

<style scoped lang="scss"></style>

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

watch(
  () => props.occupiedCellsList,
  () => {
    heterogeneityScoreSet.value = [];
    let pointSet = cellsList.value;
    let i = 0;
    while (Array.isArray(pointSet) && pointSet.length > 0) {
      pointSet = pointSet.filter(el => el.order > i);
      const heterogeneityScore = getHeterogeneityScore(pointSet);
      if (!Number.isNaN(heterogeneityScore)) {
        heterogeneityScoreSet.value.push(heterogeneityScore);
      }
      i++;
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
    <!--        {{ heterogeneityScoreSet }}<br>-->
    <!--        {{ heterogeneityScoreData }}-->
    <div id="heterogeneity-line"></div>
    <div>Heterogeneity declines per run</div>
  </div>
</template>

<style scoped lang="scss"></style>

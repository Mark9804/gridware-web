<script setup lang="ts">
import { uniq } from 'lodash-es';
import { PropType, computed, onMounted, ref, watch } from 'vue';
import { useMainStore } from '@/store/mainStore';
import {
  AnalysisGroup,
  AntvGraphPoint,
  OccupiedCell,
} from '@/types/AnalysisGroups';
import { Graph, Grid } from '@antv/g6';
import HeterogeneityGridPlotter from '@components/widgets/HeterogeneityGridPlotter.vue';
import HeterogeneityLinePlotter from '@widgets/HeterogeneityLinePlotter.vue';

const mainStore = useMainStore();

const props = defineProps({
  group: {
    type: Object as PropType<AnalysisGroup>,
    required: true,
  },
});

const graphElement = ref();

const participantIdentifier = computed(
  () => mainStore.getParticipantIdentifier
);

const allParticipants = computed(() => {
  return mainStore
    .getHeadingContent(participantIdentifier.value)
    .map(participant => {
      return {
        value: participant,
        label: participant,
      };
    });
});

const targetData = ref();

function updateTargetDataByIdentifier(identifier: string | number) {
  targetData.value = mainStore.getTargetDataByIdentifier(
    identifier,
    mainStore.getSelectedVariables
  );
  return targetData.value;
}

const selectedParticipant = ref(
  allParticipants.value[0].value as string | number
);

updateTargetDataByIdentifier(selectedParticipant.value);

const pointSet = ref([] as AntvGraphPoint[]);
const rawPointSet = ref([] as { x: number; y: number }[]);

function getPhaseCount(group: AnalysisGroup) {
  const xVariableCount = group.x_variable.variable_values.length;
  const yVariableCount = group.y_variable.variable_values.length;

  return Math.min(xVariableCount, yVariableCount);
}

const graphProperties = computed(() => {
  const allXVariableNames = props.group?.x_variable.variable_values?.map(
    variable => variable.value
  );
  const allYVariableNames = props.group?.y_variable.variable_values?.map(
    variable => variable.value
  );
  const allXValues = [];
  const allYValues = [];

  for (const xVariableName of allXVariableNames) {
    allXValues.push([...mainStore.getHeadingContent(xVariableName + '')]);
  }

  for (const yVariableName of allYVariableNames) {
    allYValues.push([...mainStore.getHeadingContent(yVariableName + '')]);
  }

  const uniqueXValues = uniq(allXValues.flat());
  const uniqueYValues = uniq(allYValues.flat());

  // FIXME: temporary
  return {
    // xCellCount: uniqueXValues.length,
    xCellCount: 5,
    // yCellCount: uniqueYValues.length,
    yCellCount: 5,
    // xCellLabels: uniqueXValues.sort(),
    xCellLabels: [0, 1, 2, 3, 4],
    // yCellLabels: uniqueYValues.sort(),
    yCellLabels: [0, 1, 2, 3, 4],
  };
});

function updateRawPointSet() {
  rawPointSet.value = [];
  if (!Array.isArray(targetData.value)) {
    for (let i = 0; i < getPhaseCount(props.group as AnalysisGroup); i++) {
      const point = {
        id: `node${i}`,
        x: targetData.value[props.group?.x_variable.variable_values[i].value],
        y:
          graphProperties.value.yCellCount -
          targetData.value[props.group?.y_variable.variable_values[i].value] -
          1,
      };
      rawPointSet.value.push(point);
    }
  } else {
    let node_id = 0;
    for (const participant of targetData.value) {
      for (let i = 0; i < getPhaseCount(props.group as AnalysisGroup); i++) {
        const point = {
          id: `node${node_id++}`,
          x: participant[props.group?.x_variable.variable_values[i].value],
          y:
            graphProperties.value.yCellCount -
            participant[props.group?.y_variable.variable_values[i].value] -
            1,
        };
        rawPointSet.value.push(point);
      }
    }
  }
}

updateRawPointSet();

function updatePointSet() {
  pointSet.value = [];
  pointSet.value = rawPointSet.value.map(point => {
    return {
      id: point.id,
      x: point.x * 40 + Math.floor(40 * Math.random() * 100) / 100,
      y: point.y * 40 + Math.floor(40 * Math.random() * 100) / 100,
      duration: 1,
    };
  });
}

updatePointSet();

const occupiedCells = ref([] as { x: number; y: number; count: number }[]);

function handleParticipantChange(selectedParticipant) {
  occupiedCells.value = [];
  updateTargetDataByIdentifier(selectedParticipant);
  updateRawPointSet();
  updatePointSet();
}

const renderData = computed(() => {
  const nodes = [...pointSet.value];
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
    });
  }
  return {
    nodes,
    edges,
  };
});

const grid = new Grid({
  grid: 10,
});
onMounted(() => {
  const graph = new Graph({
    container: graphElement.value,
    width: graphProperties.value.xCellCount * 40,
    height: graphProperties.value.yCellCount * 40,
    modes: {
      default: [],
    },
    defaultNode: {
      size: 8,
      style: {
        fill: '#C6E5FF',
        stroke: '#5B8FF9',
      },
    },
    plugins: [grid],
    defaultEdge: {
      style: {
        endArrow: true,
        stroke: '#F6BD16',
      },
    },
  });
  graph.data(renderData.value);
  graph.render();

  watch(
    () => renderData.value,
    () => {
      graph.data(renderData.value);
      graph.render();
    }
  );
});

const occupiedCellsList = ref<OccupiedCell[]>([]);

function handleOccupiedCellsListChange(value: OccupiedCell[]) {
  occupiedCellsList.value = value;
}

function handleSelectAllParticipants(value: boolean) {
  if (value) {
    handleParticipantChange('all');
  } else {
    handleParticipantChange(selectedParticipant.value);
  }
}
</script>

<template>
  <n-space vertical align="start">
    <n-space>
      <n-tag type="info">Participant</n-tag>
      <n-select
        :options="allParticipants"
        v-model:value="selectedParticipant"
        @update:value="handleParticipantChange(selectedParticipant)"
        size="small"
        filterable
      />
      <n-checkbox @update:checked="handleSelectAllParticipants">
        Aggregate all participants
      </n-checkbox>
    </n-space>

    <n-space>
      <div class="grid-container">
        <div class="legend__y-legend flex">
          <div class="legend__y-legend__title">
            {{ props.group.y_variable.variable_name }}
          </div>
          <div class="legend__y-legend__label-container flex flex-col-reverse">
            <div
              class="legend__y-legend__label-container__label flex center"
              v-for="yLabel in graphProperties.yCellLabels"
            >
              {{ yLabel }}
            </div>
          </div>
        </div>
        <div id="mountNode" ref="graphElement"></div>
        <div class="legend__x-legend flex flex-col">
          <div class="legend__x-legend__label-container flex">
            <div
              class="legend__x-legend__label-container__label flex center"
              v-for="xLabel in graphProperties.xCellLabels"
            >
              {{ xLabel }}
            </div>
          </div>
          <div class="legend__x-legend__title">
            {{ props.group.x_variable.variable_name }}
          </div>
        </div>
      </div>
      <HeterogeneityGridPlotter
        :yCellCount="graphProperties.yCellCount"
        :xCellCount="graphProperties.xCellCount"
        :nodes="renderData.nodes"
        :occupiedCells="occupiedCells"
        @update:occupiedCells="handleOccupiedCellsListChange"
      />

      <HeterogeneityLinePlotter :occupiedCellsList="occupiedCellsList" />
    </n-space>
  </n-space>
</template>

<style scoped lang="scss">
.grid-container {
  display: grid;
  grid-template-areas:
    'y-legend graph'
    '. x-legend'
    'title title';
  place-items: stretch;

  #mountNode {
    grid-area: graph;
    //width: 300px;
    //height: 300px;
    border: 1px solid #333;
  }

  .legend {
    &__y-legend {
      grid-area: y-legend;
      padding-right: 8px;

      &__title {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
      }

      &__label-container {
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-around;
        height: 100%;
        padding-left: 4px;

        &__label {
        }
      }
    }

    &__x-legend {
      grid-area: x-legend;
      padding-top: 4px;

      &__title {
        padding-bottom: 4px;
        margin-top: -8px;
      }

      &__label-container {
        display: flex;
        justify-content: space-around;
        width: 100%;

        &__label {
          padding-bottom: 8px;
        }
      }
    }
  }
}

:deep(.g6-grid-container) {
  z-index: 0 !important;
}
</style>

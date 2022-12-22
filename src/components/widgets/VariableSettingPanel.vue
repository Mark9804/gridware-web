<template>
  <n-space class="settings-panel-container" justify="center" align="center">
    <n-card
      title="Configure variables"
      class="settings-panel"
      closable
      @close="handleClose"
      :bordered="false"
    >
      <n-space vertical>
        <n-space align="center">
          <n-tag type="info" :bordered="false">X-axis variable</n-tag>
          <n-select
            class="variable-select"
            :options="variableOptions"
            @update:value="handleXAxisVariableChange"
            :value="group.x_variable.variable_name"
            filterable
          />
        </n-space>

        <n-space align="center">
          <n-tag type="info" :bordered="false">Y-axis variable</n-tag>
          <n-select
            class="variable-select"
            :options="variableOptions"
            @update:value="handleYAxisVariableChange"
            :value="group.y_variable.variable_name"
            filterable
          />
        </n-space>
      </n-space>

      <div class="preview">
        <div class="preview-title">Preview</div>
        <div>Below will give you a look of how the grid base look like.</div>
        <div class="preview-grid" v-if="!isParticipantIdIncluded">
          <div class="x_legend">
            {{ group.x_variable.variable_name }}
          </div>
          <div class="x-axis">
            <span
              v-for="x in mainStore
                .getAnalysisGroupById(group.id)
                .x_variable.variable_values.sort((x, y) => x - y)"
              :key="x"
            >
              {{ x }}
            </span>
          </div>

          <div
            class="preview-content"
            :style="{
              gridTemplateColumns: `repeat(${cellCountX}, 50px)`,
              gridTemplateRows: `repeat(${cellCountY}, 50px)`,
            }"
          >
            <!-- eslint-disable-next-line vue/require-v-for-key,vue/no-unused-vars -->
            <div v-for="n in cellCount" class="preview-cell"></div>
          </div>

          <div class="y_legend">
            {{ group.y_variable.variable_name }}
          </div>
          <div class="y-axis">
            <span
              v-for="y in mainStore
                .getAnalysisGroupById(group.id)
                .y_variable.variable_values.sort((x, y) => y - x)"
              :key="y"
            >
              {{ y }}
            </span>
          </div>
        </div>

        <div class="preview-grid-error" v-else>
          Participant ID cannot be included
        </div>
      </div>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { NCard, NSelect, NSpace, NTag } from 'naive-ui';
import { PropType, computed } from 'vue';
import { useMainStore } from '../../store/mainStore';
import { AnalysisGroup } from '../../types/analysisGroups';

const mainStore = useMainStore();
const emit = defineEmits(['close']);
function handleClose() {
  emit('close');
}
const props = defineProps({
  group: {
    type: Object as PropType<AnalysisGroup>,
    required: true,
  },
});
const selectedVariables = computed(() => {
  return mainStore.getSelectedVariables;
});

const variableOptions = computed(() => {
  return selectedVariables.value.map(variable => {
    return {
      value: variable,
      label: variable,
    };
  });
});

function handleAxisVariableChange(target: string, axis: 'x' | 'y') {
  const allValues = mainStore.getHeadingContent(target);
  const uniqueValue = [...new Set(allValues)] as string[];
  mainStore.updateVariableSettingById(
    props.group.id,
    axis,
    target,
    uniqueValue
  );
}

function handleXAxisVariableChange(target: string) {
  handleAxisVariableChange(target, 'x');
}

function handleYAxisVariableChange(target: string) {
  handleAxisVariableChange(target, 'y');
}

const cellCountX = computed(() => {
  return (
    mainStore.getAnalysisGroupById(props.group.id)?.x_variable.variable_values
      ?.length ?? 0
  );
});

const cellCountY = computed(() => {
  return (
    mainStore.getAnalysisGroupById(props.group.id)?.y_variable.variable_values
      ?.length ?? 0
  );
});

const cellCount = computed(() => cellCountX.value * cellCountY.value);

const isParticipantIdIncluded = computed(() => {
  const identifier = mainStore.getParticipantIdentifier;
  return (
    mainStore.getAnalysisGroupById(props.group.id)?.x_variable.variable_name ===
      identifier ||
    mainStore.getAnalysisGroupById(props.group.id)?.y_variable.variable_name ===
      identifier
  );
});
</script>

<style scoped lang="scss">
.settings-panel {
  background-color: var(--color-navbar-background);

  .preview {
    grid-area: preview;
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
    width: 100%;
    align-items: center;

    .preview-title {
      width: 100%;
      text-align: start;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .preview-grid-error {
      color: red;
      font-weight: bold;
    }

    .preview-grid {
      display: grid;
      grid-template-areas:
        'y-legend y-axis grid-content'
        'y-legend . x-axis'
        '. x-legend x-legend';
      grid-template-rows: max-content min-content min-content;
      grid-template-columns: min-content min-content max-content;

      .x_legend {
        grid-area: x-legend;
        margin-right: 1rem;
      }

      .x-axis {
        display: grid;
        grid-area: x-axis;
        grid-auto-flow: column;
        place-items: center;
      }

      .preview-content {
        grid-area: grid-content;
        border: solid 2px #000;
        display: grid;

        .preview-cell {
          border: solid 0.5px #ccc;
        }
      }

      .y_legend {
        grid-area: y-legend;
        margin-bottom: 1rem;
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }

      .y-axis {
        display: grid;
        grid-area: y-axis;
        grid-auto-flow: column;
        place-items: center;
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }
    }
  }
}
</style>

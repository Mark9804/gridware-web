<template>
  <n-space class="settings-panel-container" justify="center" align="center">
    <n-card
      title="Configure variables"
      class="settings-panel"
      closable
      @close="handleClose"
      :bordered="false"
    >
      <n-space vertical align="start">
        <n-card title="X-axis variable" size="small">
          <n-space vertical align="start">
            <n-space>
              <n-tag type="primary" :bordered="false">variable name</n-tag>
              <n-input
                v-model:value="xAxisVariableName"
                placeholder="Enter variable name"
                @update:value="handleXAxisVariableNameChange"
                size="small"
              />
            </n-space>
            <n-space>
              <n-tag type="primary" :bordered="false">variable type</n-tag>
              <n-select
                :options="variableTypeOptions"
                v-model:value="xAxisVariableType"
                @update:value="handleXAxisVariableTypeChange"
                size="small"
              />
            </n-space>
            <n-space>
              <n-tag type="primary" :bordered="false">variables</n-tag>
            </n-space>
            <n-space> </n-space>
          </n-space>
        </n-card>

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
        <div class="preview-grid" v-if="!isParticipantIdIncluded"></div>

        <div class="preview-grid-error" v-else>
          Participant ID cannot be included
        </div>
      </div>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { compact } from 'lodash-es';
import { PropType, Ref, computed, ref } from 'vue';
import { useMainStore } from '@/store/mainStore';
import { AnalysisGroup } from '@/types/AnalysisGroups';

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

const xAxisVariableName: Ref<string> = ref(
  mainStore.getAnalysisGroupById(props.group.id)?.x_variable.variable_name ?? ''
);

const xAxisVariableType: Ref<'categorical' | 'continuous'> = ref(
  mainStore.getAnalysisGroupById(props.group.id)?.x_variable.variable_type ??
    'categorical'
);

const variableTypeOptions = [
  {
    value: 'categorical',
    label: 'categorical',
  },
  {
    value: 'continuous',
    label: 'continuous',
  },
];

function handleAxisVariableChange(
  target: string,
  axis: 'x' | 'y',
  variableType: 'categorical' | 'continuous' = 'categorical'
) {
  const allValues = mainStore.getHeadingContent(target);
  const uniqueValue = [...new Set(allValues)] as string[];
  mainStore.updateVariableSettingById(
    props.group.id,
    axis,
    variableType,
    target,
    compact(uniqueValue)
  );
}

function handleXAxisVariableNameChange(target: string) {
  xAxisVariableName.value = target;
  handleAxisVariableChange(target, 'x');
}

function handleXAxisVariableTypeChange(target: 'categorical' | 'continuous') {
  xAxisVariableType.value = target;
  mainStore.updateVariableTypeById(props.group.id, 'x', target);
}

function handleYAxisVariableChange(target: string) {
  handleAxisVariableChange(target, 'y');
}

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

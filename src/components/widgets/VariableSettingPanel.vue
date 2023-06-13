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
        <details>
          <summary>X-axis variable</summary>

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
                  :value="xAxisVariableType"
                  @update:value="handleXAxisVariableTypeChange"
                  size="small"
                />
              </n-space>
              <n-space vertical align="start">
                <n-tag type="primary" :bordered="false">variables</n-tag>
                <n-space v-for="(xAxisVariable, index) in xAxisVariableList">
                  <n-tag type="info" :bordered="false">
                    {{ index + 1 }}
                  </n-tag>
                  <n-select
                    :options="variableOptions"
                    :value="xAxisVariable.value"
                    @update:value="
                      handleVariableListChange(
                        $event,
                        index,
                        'x',
                        xAxisVariableList
                      )
                    "
                    size="small"
                    filterable
                  />
                  <n-button
                    size="small"
                    @click="handleAddOneLine('x', index, xAxisVariableList)"
                  >
                    add
                  </n-button>
                  <n-button
                    size="small"
                    @click="handleRemoveOneLine('x', index, xAxisVariableList)"
                  >
                    remove
                  </n-button>
                </n-space>
              </n-space>
            </n-space>
          </n-card>
        </details>

        <n-space vertical align="start">
          <details>
            <summary>Y-axis variable</summary>

            <n-card title="Y-axis variable" size="small">
              <n-space vertical align="start">
                <n-space>
                  <n-tag type="primary" :bordered="false">variable name</n-tag>
                  <n-input
                    v-model:value="yAxisVariableName"
                    placeholder="Enter variable name"
                    @update:value="handleYAxisVariableNameChange"
                    size="small"
                  />
                </n-space>
                <n-space>
                  <n-tag type="primary" :bordered="false">variable type</n-tag>
                  <n-select
                    :options="variableTypeOptions"
                    :value="xAxisVariableType"
                    @update:value="handleXAxisVariableTypeChange"
                    size="small"
                  />
                </n-space>
                <n-space vertical align="start">
                  <n-tag type="primary" :bordered="false">variables</n-tag>
                  <n-space v-for="(yAxisVariable, index) in yAxisVariableList">
                    <n-tag type="info" :bordered="false">
                      {{ index + 1 }}
                    </n-tag>
                    <n-select
                      :options="variableOptions"
                      :value="yAxisVariable.value"
                      @update:value="
                        handleVariableListChange(
                          $event,
                          index,
                          'y',
                          yAxisVariableList
                        )
                      "
                      size="small"
                      filterable
                    />
                    <n-button
                      size="small"
                      @click="handleAddOneLine('y', index, yAxisVariableList)"
                    >
                      add
                    </n-button>
                    <n-button
                      size="small"
                      @click="
                        handleRemoveOneLine('y', index, yAxisVariableList)
                      "
                    >
                      remove
                    </n-button>
                  </n-space>
                </n-space>
              </n-space>
            </n-card>
          </details>
        </n-space>
      </n-space>

      <div class="preview">
        <div class="preview-grid" v-if="!isParticipantIdIncluded">
          <grid-component :group="props.group as AnalysisGroup" />
        </div>

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
import GridComponent from '@components/widgets/GridComponent.vue';

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
  props.group?.x_variable.variable_name ?? ''
);

const xAxisVariableType: Ref<'categorical' | 'continuous'> = ref(
  props.group?.x_variable.variable_type ?? 'categorical'
);

const yAxisVariableName: Ref<string> = ref(
  props.group?.y_variable.variable_name ?? ''
);

// const yAxisVariableType: Ref<'categorical' | 'continuous'> = ref(
//   props.group?.y_variable.variable_type ?? 'categorical'
// );

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
//
// function handleAxisVariableChange(
//   target: string,
//   axis: 'x' | 'y',
//   variableType: 'categorical' | 'continuous' = 'categorical'
// ) {
//   const allValues = mainStore.getHeadingContent(target);
//   const uniqueValue = [...new Set(allValues)] as string[];
//   mainStore.updateVariableSettingById(
//     props.group.id,
//     axis,
//     variableType,
//     target,
//     compact(uniqueValue)
//   );
// }

function handleVariableNameChange(name: string, axis: 'x' | 'y') {
  mainStore.updaterVariableNameById(props.group.id, axis, name);
}

function handleXAxisVariableNameChange(target: string) {
  xAxisVariableName.value = target;
  handleVariableNameChange(target, 'x');
}

function handleYAxisVariableNameChange(target: string) {
  yAxisVariableName.value = target;
  handleVariableNameChange(target, 'y');
}

function handleXAxisVariableTypeChange(target: 'categorical' | 'continuous') {
  xAxisVariableType.value = target;
  mainStore.updateVariableTypeById(props.group.id, 'x', target);
}

// function handleYAxisVariableTypeChange(target: 'categorical' | 'continuous') {
//   yAxisVariableType.value = target;
//   mainStore.updateVariableTypeById(props.group.id, 'y', target);
// }

const xAxisVariableList = computed(() => {
  const variableList = props.group?.x_variable.variable_values ?? [
    { value: '', duration: 1 },
  ];
  return 0 === compact(variableList).length
    ? [{ value: '', duration: 1 }]
    : variableList;
});

const yAxisVariableList = computed(() => {
  const variableList = props.group?.y_variable.variable_values ?? [
    { value: '', duration: 1 },
  ];
  return 0 === compact(variableList).length
    ? [{ value: '', duration: 1 }]
    : variableList;
});

function handleVariableListChange(
  target,
  index,
  axis: 'x' | 'y',
  axisVariableList
) {
  axisVariableList[index]['value'] = target;
  mainStore.updateVariableListById(props.group.id, axis, axisVariableList);
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

function handleAddOneLine(axis: 'x' | 'y', index, axisVariableList) {
  axisVariableList.splice(index + 1, 0, { value: '', duration: 1 });
  mainStore.updateVariableListById(props.group.id, axis, axisVariableList);
}

function handleRemoveOneLine(axis: 'x' | 'y', index, axisVariableList) {
  console.log(index);
  mainStore.updateVariableListById(
    props.group.id,
    axis,
    axisVariableList.filter((_, i) => i !== index)
  );
}
</script>

<style scoped lang="scss">
.settings-panel {
  background-color: var(--color-navbar-background);

  details[open] {
    summary {
      cursor: pointer;
      display: flex;
      &::before {
        content: '▼';
      }
    }
  }

  details {
    summary {
      cursor: pointer;
      display: flex;
      &::before {
        content: '▶';
      }
    }
  }
}
</style>

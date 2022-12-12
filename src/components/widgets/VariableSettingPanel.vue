<template>
  <div class="settings-panel-container">
    <div class="settings-panel shadow-farther">
      <div class="banner">
        <div class="title">Configure variables</div>
        <img
          class="close-button"
          src="/src/assets/close-button.svg"
          @click="handleClose"
        />
      </div>

      <div class="content">
        <div class="content-row">
          <div class="content-row-title">X-axis variable</div>
          <select
            class="variable-select"
            @change="handleAxisVariableChange($event, 'x')"
            :value="group.x_variable.variable_name"
          >
            <option
              v-for="variable in selectedVariables"
              :value="variable"
              :key="variable"
            >
              {{ variable }}
            </option>
          </select>
        </div>

        <div class="content-row">
          <div class="content-row-title">Y-axis variable</div>
          <select
            class="variable-select"
            @change="handleAxisVariableChange($event, 'y')"
            :value="group.y_variable.variable_name"
          >
            <option
              v-for="variable in selectedVariables"
              :value="variable"
              :key="variable"
            >
              {{ variable }}
            </option>
          </select>
        </div>
      </div>

      <div class="preview">
        <div class="title">preview</div>
        <div class="preview-grid" v-if="!isParticipantIdIncluded">
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
    </div>
  </div>
</template>

<script setup lang="ts">
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

function handleAxisVariableChange(event: Event, axis: 'x' | 'y') {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  const allValues = mainStore.getHeadingContent(value);
  const uniqueValue = [...new Set(allValues)] as string[];

  mainStore.updateVariableSettingById(props.group.id, axis, value, uniqueValue);
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
  padding: 1rem;
  background-color: var(--color-navbar-background);
  display: grid;
  grid-template-areas:
    'banner'
    'content'
    'preview';
  grid-gap: 1rem;
  //align-items: center;
  justify-items: start;

  .banner {
    grid-area: banner;
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #ccc;
    width: 100%;

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      justify-self: flex-start;
    }

    .close-button {
      justify-self: end;
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
      margin-left: 2rem;
    }
  }

  .content {
    display: grid;
    grid-auto-flow: row;
    grid-gap: 0.5rem;
    width: 100%;
    grid-area: content;

    .content-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }

  .preview {
    grid-area: preview;
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
    width: 100%;
    align-items: center;

    .preview-grid-error {
      color: red;
      font-weight: bold;
    }

    .preview-grid {
      display: grid;
      grid-template-areas:
        'y-axis grid-content'
        '. x-axis';
      grid-template-rows: max-content min-content;
      grid-template-columns: min-content max-content;

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

      .y-axis {
        display: grid;
        grid-area: y-axis;
        grid-auto-flow: row;
        place-items: center;
      }
    }
  }
}
</style>

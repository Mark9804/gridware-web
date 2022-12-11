<template>
  <div class="settings-panel-container">
    <div class="settings-panel shadow-farther">
      <div class="title">Configure variables</div>
      <img
        class="close-button"
        src="/src/assets/close-button.svg"
        @click="handleClose"
      />

      <div class="content">
        <div>{{ group.id }}</div>
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
</script>

<style scoped lang="scss">
.settings-panel {
  padding: 1rem;
  background-color: var(--color-navbar-background);
  display: grid;
  grid-template-areas:
    'title close-button'
    'content content';
  grid-template-columns: max-content auto;
  grid-gap: 1rem;
  //align-items: center;
  justify-items: start;

  .title {
    grid-area: title;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .close-button {
    grid-area: close-button;
    justify-self: end;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
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

      .content-row-title {
      }
    }
  }
}
</style>

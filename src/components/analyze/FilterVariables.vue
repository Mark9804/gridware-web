<template>
  <h2>Preview and Filter Variables</h2>
  <p>You can preview your variables here.</p>
  <p>
    For performance reasons, only the first
    <input type="number" v-model.number="maxRowCount" min="1" />
    lines of data are rendered.
  </p>
  <div class="preview-container">
    <table-viewer
      class="preview-table"
      :filter-enabled="true"
      :max-rows="maxRowCount"
    ></table-viewer>

    <div class="participant-identifier">
      <span>Identifier: </span>
      <select :value="participantIdentifier" @change="handleIdentifierChange">
        <option
          v-for="heading in mainStore.getCsvHeadings"
          :value="heading"
          :key="heading"
        >
          {{ heading }}
        </option>
      </select>
    </div>

    <div class="filter-variable-options">
      <div>
        <input
          type="checkbox"
          :checked="allChecked"
          @change="handleSelect('all')"
        /><span>Select All</span>
      </div>
      <div>
        <input
          type="checkbox"
          :checked="allUnchecked"
          @change="handleSelect('none')"
        /><span>Deselect All</span>
      </div>
    </div>

    <div class="encoding-options">
      <encoding-selector />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import { useMainStore } from '../../store/mainStore';
import EncodingSelector from '../widgets/EncodingSelector.vue';
import TableViewer from '../widgets/TableViewer.vue';

const maxRowCount = ref(30);
const mainStore = useMainStore();

const checkedVariables = computed(() => mainStore.getSelectedVariables);
const allHeadings = computed(() => mainStore.getCsvHeadings);

const allChecked = computed(() => {
  return allHeadings.value.length === checkedVariables.value.length;
});

const allUnchecked = computed(() => {
  return checkedVariables.value.length === 0;
});

const participantIdentifier = computed(() => {
  return mainStore.getParticipantIdentifier;
});

function handleSelect(selectionType: string) {
  switch (selectionType) {
    case 'all':
      if (allChecked.value) {
        mainStore.deselectAllVariables();
      } else {
        mainStore.selectAllVariables();
      }
      break;
    case 'none':
      if (allUnchecked.value) {
        // do nothing
      } else {
        mainStore.deselectAllVariables();
      }
      break;
  }
}

function handleIdentifierChange(event: Event) {
  const target = event.target as HTMLInputElement;
  mainStore.setParticipantIdentifier(target.value);
}
</script>

<style scoped lang="scss">
.preview-container {
  grid-gap: 1rem;
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: max-content max-content;
  grid-template-areas:
    'table options-participant-identifier'
    'table options-variable-selection'
    'table options-encoding-selection';
}

.preview-table {
  grid-area: table;
}

.filter-variable-options {
  display: flex;
  grid-area: options-variable-selection;
  flex-direction: column;
  align-items: flex-start;
}

.encoding-options {
  display: flex;
  grid-area: options-encoding-selection;
  flex-direction: column;
  align-items: flex-start;
}

input[type='checkbox'] {
  margin-left: 0;
}

input[type='number'] {
  margin: 0 0.5rem;
  border-top: none;
  border-right: none;
  border-left: none;
  width: 3rem;
  text-align: center;
}
</style>

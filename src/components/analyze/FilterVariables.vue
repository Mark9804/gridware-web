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

    <n-space class="participant-identifier" align="center">
      <n-tag type="info" :bordered="false">Identifier</n-tag>
      <n-select
        :value="participantIdentifier"
        :options="headingValues"
        @update:value="handleIdentifierChange"
        filterable
      />
    </n-space>

    <n-space vertical class="filter-variable-options">
      <n-space>
        <n-switch
          :value="allChecked"
          @update:value="handleSelect('all')"
        /><span>Select All</span>
      </n-space>
      <n-space>
        <n-switch
          :value="allUnchecked"
          @update:value="handleSelect('none')"
        /><span>Deselect All</span>
      </n-space>
    </n-space>

    <div class="encoding-options">
      <encoding-selector />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSelect, NSpace, NSwitch, NTag } from 'naive-ui';
import { computed, ref } from 'vue';
import { useMainStore } from '../../store/mainStore';
import EncodingSelector from '../widgets/EncodingSelector.vue';
import TableViewer from '../widgets/TableViewer.vue';

const maxRowCount = ref(30);
const mainStore = useMainStore();

const checkedVariables = computed(() => mainStore.getSelectedVariables);
const allHeadings = computed(() => mainStore.getCsvHeadings);

const headingValues = computed(() => {
  return allHeadings.value.map(heading => {
    return {
      label: heading,
      value: heading,
    };
  });
});

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

function handleIdentifierChange(target: string) {
  mainStore.setParticipantIdentifier(target);
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

.participant-identifier {
  grid-area: options-participant-identifier;
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

input[type='number'] {
  margin: 0 0.5rem;
  border-top: none;
  border-right: none;
  border-left: none;
  width: 3rem;
  text-align: center;
}
</style>

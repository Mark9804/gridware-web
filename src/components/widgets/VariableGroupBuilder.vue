<template>
  <div class="variable-group-container">
    <h3 class="main-title">Add Variable Group</h3>
    <h3 class="participant-title">Add Participants</h3>
    <variable-group-row
      v-for="group in analysisGroups"
      :key="group.id"
      :group="group"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMainStore } from '../../store/mainStore';
import { AnalysisGroup } from '../../types/analysisGroups';
import VariableGroupRow from './VariableGroupRow.vue';

const mainStore = useMainStore();
const analysisGroups = computed(() => {
  const groups = mainStore.getAnalysisGroups;
  if (groups.length === 0) {
    initGroup();
  }
  return mainStore.getAnalysisGroups;
});

function initGroup() {
  const uuid = getUniqueKey();
  const group: AnalysisGroup = {
    id: uuid,
    groupName: '',
    x_variable: { variable_name: '' },
    y_variable: { variable_name: '' },
  };
  mainStore.updateAnalysisGroup(group);
}

function getUniqueKey() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = 'x' === c ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
</script>

<style scoped lang="scss">
.variable-group-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: row;
  border-left: solid 1px #ccc;
  border-right: solid 1px #ccc;
  border-top: solid 1px #ccc;

  h3 {
    border-bottom: 1px solid #ccc;
    margin: 0;
    padding: 1rem;
  }

  .main-title {
    grid-column: 1 / 3;
    border-right: 1px solid #ccc;
  }

  .participant-title {
    grid-column: 3 / 4;
  }
}
</style>

<template>
  <div class="variable-group-row">
    <div class="variable variable-1">
      <span>{{
        group.x_variable.variable_name
          ? group.x_variable.variable_name
          : 'Variable 1'
      }}</span>
      <img
        class="setting-icon"
        src="/src/assets/setting.svg"
        alt="setting"
        @click="showSettings = true"
      />
    </div>
    <div class="variable variable-2">
      <span>{{
        group.y_variable.variable_name
          ? group.y_variable.variable_name
          : 'Variable 2'
      }}</span>
      <img
        class="setting-icon"
        src="/src/assets/setting.svg"
        alt="setting"
        @click="showSettings = true"
      />
    </div>
    <div class="actions">
      <n-button
        type="info"
        secondary
        :bordered="false"
        size="small"
        @click="handleAddOneLine"
      >
        Add
      </n-button>
      <n-button type="error" secondary :bordered="false" size="small">
        Remove
      </n-button>
    </div>
    <variable-setting-panel
      :group="group"
      v-if="showSettings"
      @close="showSettings = false"
    />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { PropType, ref } from 'vue';
import { useMainStore } from '@/store/mainStore';
import { AnalysisGroup } from '@/types/AnalysisGroups';
import VariableSettingPanel from './VariableSettingPanel.vue';

const mainStore = useMainStore();

function getUniqueKey() {
  return uuidv4();
}

defineProps({
  group: {
    type: Object as PropType<AnalysisGroup>,
    required: true,
  },
});

const showSettings = ref(false);

function handleAddOneLine() {
  const uuid = getUniqueKey();
  const group: AnalysisGroup = {
    id: uuid,
    groupName: '',
    x_variable: {
      variable_name: '',
      variable_type: 'categorical',
      variable_values: [
        {
          value: '',
          duration: 1,
        },
      ],
    },
    y_variable: {
      variable_name: '',
      variable_type: 'categorical',
      variable_values: [
        {
          value: '',
          duration: 1,
        },
      ],
    },
  };
  mainStore.updateAnalysisGroup(group);
}
</script>

<style scoped lang="scss">
.variable-group-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: row;
  border-bottom: solid 1px #ccc;
  grid-column: 1 / 4;

  & > div {
    padding: 0.5rem;
  }

  .variable-1 {
    grid-column: 1 / 2;
    border-right: 1px solid #ccc;
  }

  .variable-2 {
    grid-column: 2 / 3;
    border-right: 1px solid #ccc;
  }
}

.variable {
  display: flex;
  justify-content: center;
}

.setting-icon {
  width: 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
}
</style>

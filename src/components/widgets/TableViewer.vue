<template>
  <div class="content-preview-table">
    <div
      class="heading-columns"
      :class="checkedVariables.includes(heading) ? '' : 'unselected'"
      v-for="heading in mainStore.getCsvHeadings"
      :key="heading"
    >
      <div class="label">
        <n-checkbox
          v-if="filterEnabled"
          :checked="checkedVariables.includes(heading)"
          @update:checked="updateCheckedVariables(heading)"
        />
        <span>{{ heading }}</span>
      </div>
      <!-- eslint-disable vue/valid-v-for,vue/require-v-for-key -->
      <div
        class="table-content"
        v-for="content in mainStore
          .getHeadingContent(heading)
          .slice(0, maxRowCount)"
      >
        {{ content }}
      </div>
      <!-- eslint-enable vue/valid-v-for,vue/require-v-for-key -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMainStore } from '@/store/mainStore';

const props = defineProps({
  filterEnabled: {
    type: Boolean,
    default: false,
  },
  maxRows: {
    type: Number,
    default: 30,
  },
});

const mainStore = useMainStore();
const checkedVariables = computed<string[]>(
  () => mainStore.getSelectedVariables
);

function updateCheckedVariables(heading: string) {
  mainStore.setSelectedVariables(heading);
}

const maxRowCount = computed<number>(() => {
  return !isNaN(props.maxRows) ? Math.max(props.maxRows, 0) || 30 : 30;
});
</script>

<style scoped lang="scss">
.content-preview-table {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  content-visibility: auto;
  border: 1px solid var(--color-border-lighter, #ccc);
  max-width: 800px;
  height: 20rem;
  overflow: scroll;
  font-size: 0.9rem;
  font-family: 'JetBrains Mono', -apple-system, 'system ui', monospace;

  &:empty::after {
    content: 'No data to preview';
    color: #ccc;
    font-style: italic;
    font-weight: bold;
    font-size: 1.2rem;
  }
}

.heading-columns {
  border-right: 1px solid var(--color-border, #666);

  &.unselected {
    .label {
      opacity: 0.5;
    }

    .table-content {
      color: #ccc;
    }
  }

  &:last-child {
    border-right: none;
  }

  .label {
    display: flex;
    border-bottom: 1px solid var(--color-border, #666);
    background-color: var(--color-background-label);
    padding: 0 0.5rem;
    height: 1.5rem;
    position: sticky;
    top: 0;
    align-items: center;

    span {
      white-space: nowrap;
    }
  }

  .table-content {
    border-bottom: 1px solid var(--color-border-lighter, #ccc);
    padding: 0.1rem 0.5rem;

    &:empty::after {
      content: 'NaN';
      color: #808080;
    }
  }
}
</style>

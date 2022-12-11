<template>
  <div class="container-analyzer fill-screen">
    <div>
      <h2>Import your data</h2>
      <div>
        <p>To start, please import your data as csv or json format.</p>
        <p>
          <strong
            >The data will stay on your computer and will not be
            uploaded</strong
          >.
        </p>
        <input type="file" @change="handleFileChange" />
      </div>
    </div>

    <div class="preview-container">
      <filter-variables v-if="mainStore.getCsvHeadings.length !== 0" />
    </div>

    <div>
      <build-variable-groups />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useMainStore } from '../../store/mainStore';
import { convertCsv } from '../../utils/convertCsv';
import BuildVariableGroups from './BuildVariableGroups.vue';
import FilterVariables from './FilterVariables.vue';

const mainStore = useMainStore();

const fileEncoding = computed(() => {
  return mainStore.getEncoding;
});

function readFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target?.result as string);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsText(file, fileEncoding.value);
  });
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  const fileName = file.name ?? '';
  mainStore.submitFile(file);

  if (/\.csv$/i.test(fileName)) {
    readFile(file)
      .then((data: string) => {
        mainStore.setCsvProps(convertCsv(data));
      })
      .catch(e => {
        console.error(e);
      });
  } else if (/\.json$/i.test(fileName)) {
    readFile(file)
      .then((data: string) => {
        mainStore.setCsvProps(JSON.parse(data));
      })
      .catch(e => {
        console.error(e);
      });
  }
}

function handleEncodingChange() {
  const file = mainStore.getFile;
  if (file?.name) {
    readFile(file)
      .then((data: string) => {
        mainStore.setCsvProps(convertCsv(data));
      })
      .catch(e => {
        console.error(e);
      });
  }
}

watch(fileEncoding, handleEncodingChange);
</script>

<style scoped lang="scss">
.container-analyzer {
  display: grid;
}

h2 {
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
}
</style>

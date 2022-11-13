<template>
  <div class="fill-screen flex-vertical">
    <h2>Import your data</h2>
    <div>
      <p>To start, please import your data as csv or json format.</p>
      <p>
        <strong
          >The data will stay on your computer and will not be uploaded</strong
        >.
      </p>
      <input type="file" @change="handleFileChange" />
    </div>

    <div class="preview-container">
      <filter-variables v-if="mainStore.getCsvHeadings.length !== 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useMainStore } from "../store/mainStore.js";
import { convertCsv } from "../utils/convertCsv";
import AnalyzeSelectedVariables from "./AnalyzeSelectedVariables.vue";
import FilterVariables from "./FilterVariables.vue";

const mainStore = useMainStore();

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file, fileEncoding.value);
  });
}

const fileEncoding = computed<string>(() => mainStore.getEncoding);

function handleFileChange(event: Event, isFile = false) {
  const target = isFile ? event : (event.target as HTMLInputElement);
  const file: Event | HTMLInputElement | File = isFile
    ? target
    : (target.files as FileList)[0];
  const fileName = file.name ?? "";
  mainStore.submitFileBlob(file);

  if (/\.csv$/i.test(fileName)) {
    readFile(file)
      .then((data) => {
        mainStore.setCsvProps(convertCsv(data));
      })
      .catch((e) => {
        console.log(e);
      });
  } else if (/\.json$/i.test(fileName)) {
    readFile(file)
      .then((data) => {
        mainStore.setCsvProps(JSON.parse(data));
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    // do nothing
  }
}

watch(fileEncoding, (newValue) => {
  const fileBlob: File = mainStore.getFile;
  handleFileChange(fileBlob, true);
});
</script>

<style scoped lang="scss">
h2 {
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
}
</style>

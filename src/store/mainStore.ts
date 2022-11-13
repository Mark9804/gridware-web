import { keys } from "lodash-es";
import { defineStore } from "pinia";

export const useMainStore = defineStore({
  id: "main",
  state: () => {
    return {
      csvData: {
        file: null,
        encoding: "utf-8",
        content: [],
        headings: [],
      },
      customSettings: {
        selectedVariables: [],
      },
    };
  },
  persist: true,
  getters: {
    getCsvHeadings: (state) => state.csvData.headings,
    getHeadingContent: (state) => (headingString) =>
      state.csvData.content.map((record) => record[headingString]),
    getSelectedVariables: (state) => state.customSettings.selectedVariables,
    getEncoding: (state) => state.csvData.encoding,
    getFile: (state) => state.csvData.file,
  },
  actions: {
    submitFileBlob(fileBlob) {
      this.csvData.file = fileBlob;
    },
    setCsvProps(csvContent) {
      this.csvData.content = csvContent;
      const headings = keys(csvContent[0]);
      this.csvData.headings = headings;
      this.customSettings.selectedVariables = headings;
    },
    setSelectedVariables(heading) {
      const selectedVariables = this.customSettings.selectedVariables;
      if (selectedVariables.includes(heading)) {
        this.customSettings.selectedVariables = selectedVariables.filter(
          (variable) => variable !== heading
        );
      } else {
        this.customSettings.selectedVariables = [...selectedVariables, heading];
      }
    },
    selectAllVariables() {
      this.customSettings.selectedVariables = this.csvData.headings;
    },
    deselectAllVariables() {
      this.customSettings.selectedVariables = [];
    },
    setEncoding(encoding) {
      this.csvData.encoding = encoding;
    },
  },
});

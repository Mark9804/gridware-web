import { keys } from 'lodash-es';
import { defineStore } from 'pinia';
import { CsvContent } from '../types/store';

export const useMainStore = defineStore({
  id: 'main',
  state: () => {
    return {
      csvData: {
        file: new File([], ''),
        encoding: 'utf-8',
        content: [] as CsvContent[],
        headings: [] as string[],
      },
      customSettings: {
        selectedVariables: [] as string[],
        participantIdentifier: '',
      },
      analysisSettings: {
        analysisGroups: [],
        mergeSameVariableGroups: false,
      },
    };
  },
  persist: true,
  getters: {
    getCsvHeadings: state => state.csvData.headings,
    getHeadingContent: state => (headingString: string) =>
      state.csvData.content.map(record => record[headingString]),
    getSelectedVariables: state => state.customSettings.selectedVariables,
    getEncoding: state => state.csvData.encoding,
    getFile: state => state.csvData.file,
    getParticipantIdentifier: state =>
      state.customSettings.participantIdentifier,
  },
  actions: {
    submitFile(file: File) {
      this.csvData.file = file;
    },
    setCsvProps(csvContent: CsvContent[]) {
      this.csvData.content = csvContent;
      const headings = keys(csvContent[0]);
      this.csvData.headings = headings;
      this.customSettings.selectedVariables = headings;
    },
    setSelectedVariables(heading: string) {
      const selectedVariables: string[] = this.customSettings.selectedVariables;
      if (selectedVariables.includes(heading)) {
        this.customSettings.selectedVariables = selectedVariables.filter(
          variable => variable !== heading
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
    setEncoding(encoding: string) {
      this.csvData.encoding = encoding;
    },
    setParticipantIdentifier(identifier: string) {
      this.customSettings.participantIdentifier = identifier;
    },
  },
});

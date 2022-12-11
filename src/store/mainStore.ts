import { keys } from 'lodash-es';
import { defineStore } from 'pinia';
import { AnalysisGroup } from '../types/analysisGroups';
import { CsvContent } from '../types/store';

export const useMainStore = defineStore({
  id: 'gridware',
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
        analysisGroups: [] as AnalysisGroup[],
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
    getAnalysisGroups: state => state.analysisSettings.analysisGroups,
    getAnalysisGroupById: state => (id: string) => {
      return state.analysisSettings.analysisGroups.find(
        group => group.id === id
      );
    },
    getMergeSameSettings: state =>
      state.analysisSettings.mergeSameVariableGroups,
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
      this.customSettings.participantIdentifier =
        headings.length > 0 ? headings[0] : '';
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
    updateAnalysisGroup(group: AnalysisGroup) {
      const analysisGroups = this.analysisSettings.analysisGroups;
      const index = analysisGroups.findIndex(
        analysisGroup => analysisGroup.id === group.id
      );
      if (index !== -1) {
        analysisGroups[index] = group;
        this.analysisSettings.analysisGroups = analysisGroups;
      } else {
        this.analysisSettings.analysisGroups = [...analysisGroups, group];
      }
    },
    updateVariableSettingById(
      groupId: string,
      axis: 'x' | 'y',
      variableName: string,
      variableValues: string[]
    ) {
      const analysisGroups = this.analysisSettings.analysisGroups;
      const index = analysisGroups.findIndex(
        analysisGroup => analysisGroup.id === groupId
      );
      if (index !== -1) {
        analysisGroups[index][`${axis}_variable`] = {
          variable_name: variableName,
          variable_values: variableValues,
        };
        this.analysisSettings.analysisGroups = analysisGroups;
      }
    },
  },
});

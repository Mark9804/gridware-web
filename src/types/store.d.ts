// eslint-disable sort-exports/sort-exports

export interface CsvContent {
  [key: string]: string | number | boolean | undefined;
}

export interface CsvData {
  file: Blob;
  encoding: string;
  content: object[];
  headings: string[];
}

export interface CustomSettings {
  selectedVariables: string[];
  participantIdentifier: string;
}

export interface X_Variable {
  label: string;
  columns_count: number;
}

export interface AnalysisGroups {
  variables: {
    x_variable: string;
  };
}

export interface AnalysisSettings {
  analysisGroups: AnalysisGroups[];
}

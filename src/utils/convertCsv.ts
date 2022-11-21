import { CsvContent } from '../types/store';

function convertCsv(csvText: string, delimiter = ','): CsvContent[] {
  const lines: string[] = [];
  const linesArray = csvText.split('\n');
  // for trimming and deleting extra space
  linesArray.forEach(e => {
    const row = e.replace(/\s+,+|,+\s+/g, ',').trim();
    lines.push(row);
  });
  lines.splice(lines.length - 1, 1);
  const result = [];

  const headers = lines[0]?.split(delimiter) || [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {} as { [key: string]: string | number | boolean | undefined };
    const currentLine = lines[i].split(delimiter);

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }
    result.push(obj);
  }
  return result;
}

export { convertCsv };

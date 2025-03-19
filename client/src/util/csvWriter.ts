import { ExportToCsv } from 'export-to-csv';

import { AnyObject } from '../types';

export class CSVWriter {
  private filename: string;
  private headers: string[];
  private chunks: Record<string, AnyObject>[][] = [];
  private maxChunkSize = 1000; // Maximum number of rows per chunk
  private currentChunk: Record<string, AnyObject>[] = [];

  constructor({ filename, headers }: { filename: string; headers: string[] }) {
    this.filename = filename;
    this.headers = headers;
  }

  async appendRows(newRows: Record<string, AnyObject>[]) {
    // Add rows to current chunk
    this.currentChunk = [...this.currentChunk, ...newRows];

    // If current chunk exceeds max size, store it and start a new chunk
    if (this.currentChunk.length >= this.maxChunkSize) {
      this.chunks.push([...this.currentChunk]);
      this.currentChunk = [];
    }
  }

  updateFilename(newFilename: string) {
    this.filename = newFilename;
  }

  async download() {
    // Add the last chunk if it has any data
    if (this.currentChunk.length > 0) {
      this.chunks.push(this.currentChunk);
    }

    // Flatten all chunks into a single array
    // This is a compromise - we still need to combine all data for the export
    // but we've been managing memory in chunks up until this point
    const allData = this.chunks.flat();

    const csvExportOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: this.headers,
      filename: this.filename,
    };

    const csvExporter = new ExportToCsv(csvExportOptions);

    // Generate CSV with all data
    csvExporter.generateCsv(allData);

    // Clean up memory
    this.chunks = [];
    this.currentChunk = [];
  }
}

import Base from './base';

export default class GeneratePdfFile extends Base {
  generatePdf(htmlString: string): Promise<string> {
    return this.apiClient.post('generate-pdf', { data: htmlString });
  }
}

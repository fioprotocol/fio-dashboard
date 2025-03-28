import Base from './base';

export default class GeneratePdfFile extends Base {
  generateOrderPdf({
    orderId,
    publicKey,
    timezone,
  }: {
    orderId: string;
    publicKey?: string;
    timezone?: string;
  }): Promise<string> {
    return this.apiClient.post('generate-order-pdf', {
      orderId,
      publicKey,
      timezone,
    });
  }
}

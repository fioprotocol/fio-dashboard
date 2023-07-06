import Base from './base';

export default class General extends Base {
  getImageHash(imageUrl: string): Promise<string> {
    return this.apiClient.get('fetch-image-hash', { imageUrl });
  }
}

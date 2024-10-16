import Base from './base';

import { AbstractEmailVerificationResponse } from './responses';

export default class General extends Base {
  // TODO: commented due to DASH-711 task. We hide it until figure out with hash
  // getImageHash(imageUrl: string): Promise<string> {
  //   return this.apiClient.get('fetch-image-hash', { imageUrl });
  // }
  getUrlContent(url: string): Promise<string | null> {
    return this.apiClient.get('get-url-content', { url });
  }
  abstractEmailVerification(
    email: string,
  ): Promise<AbstractEmailVerificationResponse> {
    return this.apiClient.get('verify-abstract-email', { email });
  }
}

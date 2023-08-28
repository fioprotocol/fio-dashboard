import Base from './base';

import { AbstractEmailVerificationResponse } from './responses';

export default class General extends Base {
  getImageHash(imageUrl: string): Promise<string> {
    return this.apiClient.get('fetch-image-hash', { imageUrl });
  }
  abstractEmailVerification(
    email: string,
  ): Promise<AbstractEmailVerificationResponse> {
    return this.apiClient.get('verify-abstract-email', { email });
  }
}

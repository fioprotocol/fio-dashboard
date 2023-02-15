import Base from './base';

import {
  FioRegApiUrlsResponse,
  FioRegCaptchaResponse,
  FioRegPricesResponse,
} from './responses';

export default class FioReg extends Base {
  prices(forceRefresh = false): Promise<FioRegPricesResponse> {
    return this.apiClient.get('reg/prices', {
      forceRefresh,
    });
  }
  initCaptcha(): Promise<FioRegCaptchaResponse> {
    return this.apiClient.post('reg/captcha/init', {});
  }
  apiUrls(): Promise<FioRegApiUrlsResponse> {
    return this.apiClient.get('reg/api-urls');
  }
}

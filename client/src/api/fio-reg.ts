import Base from './base';

import {
  FioRegCaptchaResponse,
  FioRegDomainsResponse,
  FioRegPricesResponse,
  FioRegRegisterResponse,
} from './responses';

export default class FioReg extends Base {
  prices(): Promise<FioRegPricesResponse> {
    return this.apiClient.get('reg/prices');
  }
  domains(): Promise<FioRegDomainsResponse> {
    return this.apiClient.get('reg/domains');
  }
  register(data: {
    address: string;
    publicKey: string;
    refCode?: string;
    verifyParams?: {
      pin?: string;
      geetest_challenge?: string;
      geetest_validate?: string;
      geetest_seccode?: string;
    };
  }): Promise<FioRegRegisterResponse> {
    return this.apiClient.post('reg/register', { data });
  }
  initCaptcha(): Promise<FioRegCaptchaResponse> {
    return this.apiClient.post('reg/captcha/init', {});
  }
}

import Base from './base';

export default class FioReg extends Base {
  prices() {
    return this.apiClient.get('reg/prices');
  }
  domains() {
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
  }) {
    return this.apiClient.post('reg/register', { data });
  }
  initCaptcha() {
    return this.apiClient.post('reg/captcha/init', {});
  }
}

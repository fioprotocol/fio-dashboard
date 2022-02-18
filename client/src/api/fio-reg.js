import { convertPrices } from '../util/fio';

import Base from './base';

export default class FioReg extends Base {
  async prices() {
    const prices = await this.apiClient.get('reg/prices');
    return convertPrices(prices);
  }
  domains() {
    return this.apiClient.get('reg/domains');
  }
  register(data) {
    return this.apiClient.post('reg/register', { data });
  }
  initCaptcha() {
    return this.apiClient.post('reg/captcha/init');
  }
}

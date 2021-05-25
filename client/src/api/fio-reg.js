import Base from './base';

export default class FioReg extends Base {
  prices() {
    return this.apiClient.get('reg/prices');
  }
  domains() {
    return this.apiClient.get('reg/domains');
  }
  register(data) {
    return this.apiClient.post('reg/register', { data });
  }
}

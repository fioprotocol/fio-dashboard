import Base from './base';

export default class Users extends Base {
  list(query) {
    return this.apiClient.get('users', query);
  }

  show(id) {
    return this.apiClient.get(`users/${id}`);
  }

  recordFreeAddress(freeAddress) {
    return this.apiClient.post(`users/freeAddress`, { data: freeAddress });
  }
}

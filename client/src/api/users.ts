import Base from './base';

export default class Users extends Base {
  list() {
    return this.apiClient.get('users');
  }

  show(id: string) {
    return this.apiClient.get(`users/${id}`);
  }
}

import Base from './base';

export default class Contacts extends Base {
  list() {
    return this.apiClient.get('contacts');
  }

  create(data: { name: string }) {
    return this.apiClient.post('contacts', { data });
  }
}

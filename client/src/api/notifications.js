import Base from './base';

export default class Notifications extends Base {
  list(query) {
    return this.apiClient.get('notifications', query);
  }

  create(data) {
    return this.apiClient.post('notifications', { data });
  }

  update(data) {
    return this.apiClient.put('notifications', { data });
  }
}

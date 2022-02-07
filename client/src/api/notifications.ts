import Base from './base';

export default class Notifications extends Base {
  list(query?: { type: string; contentType: string; createdAt: string }) {
    return this.apiClient.get('notifications', query);
  }

  create(data: {
    type: string;
    action: string;
    contentType: string;
    title: string;
    message: string;
    pagesToShow: string[];
  }) {
    return this.apiClient.post('notifications', { data });
  }

  update(data: { id: number; closeDate: string }) {
    return this.apiClient.put('notifications', { data });
  }
}

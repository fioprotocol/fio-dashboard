import Base from './base';

import {
  NotificationsCreateResponse,
  NotificationsListResponse,
  NotificationsUpdateResponse,
} from './responses';

export default class Notifications extends Base {
  list(query?: {
    type: string;
    contentType: string;
    createdAt: string;
  }): Promise<NotificationsListResponse> {
    return this.apiClient.get('notifications', query);
  }

  create(data: {
    type: string;
    action: string;
    contentType: string;
    title?: string;
    message?: string;
    pagesToShow: string[];
  }): Promise<NotificationsCreateResponse> {
    return this.apiClient.post('notifications', { data });
  }

  update(data: {
    id: number;
    closeDate: string;
  }): Promise<NotificationsUpdateResponse> {
    return this.apiClient.put('notifications', { data });
  }
}

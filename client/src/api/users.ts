import Base from './base';

import { UserUpdateEmailNotificationResponse } from './responses';

export default class Users extends Base {
  updateEmailNotifications(data: {}): Promise<
    UserUpdateEmailNotificationResponse
  > {
    return this.apiClient.put('users/update-email-notification-params', data);
  }
  verifyAlternativeUser(): Promise<string> {
    return this.apiClient.get('verify-alternative-user');
  }
}

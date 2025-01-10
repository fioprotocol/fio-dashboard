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
  getFreeAddresses(
    data: {
      publicKey?: string;
    } = {},
  ): Promise<{ name: string; publicKey: string }[]> {
    return this.apiClient.get('free-addresses', data);
  }
}

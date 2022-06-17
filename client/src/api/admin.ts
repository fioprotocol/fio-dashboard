import Base from './base';

import {
  AdminUsersListResponse,
  RemoveAdminResponse,
  AdminInviteResponse,
} from './responses';

export default class Admin extends Base {
  list(): Promise<AdminUsersListResponse> {
    return this.apiClient.get(`admin-users`);
  }
  remove(adminUserId: string): Promise<RemoveAdminResponse> {
    return this.apiClient.delete(`admin-users`, { adminUserId });
  }
  invite(inviteEmail: string): Promise<AdminInviteResponse> {
    return this.apiClient.post(`admin-users/invite`, { inviteEmail });
  }
}

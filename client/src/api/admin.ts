import Base from './base';

import { AdminUsersListResponse, RemoveAdminResponse } from './responses';

export default class Admin extends Base {
  list(): Promise<AdminUsersListResponse> {
    return this.apiClient.get(`admin-users`);
  }
  remove(adminUserId: string): Promise<RemoveAdminResponse> {
    return this.apiClient.delete(`admin-users`, { adminUserId });
  }
}

import Base from './base';

import {
  AdminInviteResponse,
  AdminOrderItemResponse,
  AdminOrdersListResponse,
  AdminUsersListResponse,
  AuthLoginResponse,
  RemoveAdminResponse,
} from './responses';

export default class Admin extends Base {
  adminList(limit: number, offset: number): Promise<AdminUsersListResponse> {
    return this.apiClient.get('admin/list', { limit, offset });
  }
  adminUserProfile(id: string): Promise<AdminUsersListResponse> {
    return this.apiClient.get(`admin/info/${id}`);
  }
  ordersList(limit: number, offset: number): Promise<AdminOrdersListResponse> {
    return this.apiClient.get('admin/orders', { limit, offset });
  }
  order(id: string): Promise<AdminOrderItemResponse> {
    return this.apiClient.get(`admin/orders/${id}`);
  }
  removeAdmin(adminUserId: string): Promise<RemoveAdminResponse> {
    return this.apiClient.delete(`admin`, { adminUserId });
  }
  inviteAdmin(email: string): Promise<AdminInviteResponse> {
    return this.apiClient.post(`admin/invite`, { email });
  }
  checkIsAdminInvited({
    email,
    hash,
  }: {
    email: string;
    hash: string;
  }): Promise<AuthLoginResponse> {
    return this.apiClient.get('admin-auth/create/check', {
      email,
      hash,
    });
  }
}

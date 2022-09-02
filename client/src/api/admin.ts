import Base from './base';

import {
  AdminFioAccountsProfilesListResponse,
  AdminGeneralCreateResponse,
  AdminOrderItemResponse,
  AdminOrdersListResponse,
  AdminSearchResponse,
  AdminUsersListResponse,
  AuthLoginResponse,
  RemoveAdminResponse,
} from './responses';

export default class Admin extends Base {
  adminList(limit: number, offset: number): Promise<AdminUsersListResponse> {
    return this.apiClient.get('admin/list', { limit, offset });
  }
  fioAccountsProfilesList(
    limit: number,
    offset: number,
  ): Promise<AdminFioAccountsProfilesListResponse> {
    return this.apiClient.get('admin/accounts/list', { limit, offset });
  }
  createFioAccountProfile(data: {
    name: string;
    actor: string;
    permission: string;
  }): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/accounts`, data);
  }
  editFioAccountProfile(
    data: {
      name: string;
      actor: string;
      permission: string;
    },
    id: string,
  ): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/accounts/${id}`, data);
  }
  adminUserProfile(id: string): Promise<AdminUsersListResponse> {
    return this.apiClient.get(`admin/info/${id}`);
  }
  ordersList(limit: number, offset: number): Promise<AdminOrdersListResponse> {
    return this.apiClient.get('admin/orders', { limit, offset });
  }
  search(value: string): Promise<AdminSearchResponse> {
    return this.apiClient.get('admin/search', { name: value });
  }
  order(id: string): Promise<AdminOrderItemResponse> {
    return this.apiClient.get(`admin/orders/${id}`);
  }
  removeAdmin(adminUserId: string): Promise<RemoveAdminResponse> {
    return this.apiClient.delete(`admin`, { adminUserId });
  }
  inviteAdmin(email: string): Promise<AdminGeneralCreateResponse> {
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

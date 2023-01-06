import Base from './base';

import {
  AdminFioAccountsProfilesListResponse,
  AdminGeneralCreateResponse,
  AdminOrderItemResponse,
  AdminOrdersListResponse,
  AdminPartnersListResponse,
  AdminSearchResponse,
  AdminUsersListResponse,
  AuthLoginResponse,
  RemoveAdminResponse,
  SendResetAdminPasswordResponse,
  UsersDetailsResponse,
  UsersListResponse,
} from './responses';
import { RefProfile } from '../types';

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
  exportOrdersData(): Promise<AdminOrdersListResponse> {
    return this.apiClient.get('admin/orders/export');
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
  sendResetAdminPassword(
    adminUserId: string,
  ): Promise<SendResetAdminPasswordResponse> {
    return this.apiClient.post(`admin/${adminUserId}/send-reset-password`, {});
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
  checkIsAdminPasswordResetSuccess({
    email,
    hash,
  }: {
    email: string;
    hash: string;
  }): Promise<AuthLoginResponse> {
    return this.apiClient.get('admin-auth/reset-password/check', {
      email,
      hash,
    });
  }
  partnersList(
    limit: number,
    offset: number,
  ): Promise<AdminPartnersListResponse> {
    return this.apiClient.get('admin/partners/list', { limit, offset });
  }
  createPartner(data: RefProfile): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/partners`, data);
  }
  editPartner(data: RefProfile): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/partners/${data.id}`, data);
  }

  usersList(limit: number, offset: number): Promise<UsersListResponse[]> {
    return this.apiClient.get('admin/reg-users', { limit, offset });
  }

  usersDetailedList(): Promise<UsersDetailsResponse[]> {
    return this.apiClient.get('admin/detailed-list-reg-users');
  }

  userDetails(id: string): Promise<UsersDetailsResponse> {
    return this.apiClient.get(`admin/reg-users/${id}`);
  }
}

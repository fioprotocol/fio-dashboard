import Base from './base';

import {
  AdminChange2Fa,
  AdminChangePasswordResponse,
  AdminDefaults,
  AdminFioAccountsProfilesListResponse,
  AdminFioApiUrlsListResponse,
  AdminFioApiUrlsListUpdateResponse,
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
import { FioApiUrl, OrderListFilters, RefProfile } from '../types';

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

  deleteFioAccountProfile(id: string): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.delete(`admin/accounts/${id}`, {});
  }

  adminUserProfile(id: string): Promise<AdminUsersListResponse> {
    return this.apiClient.get(`admin/info/${id}`);
  }

  ordersList(
    limit: number,
    offset: number,
    filters: OrderListFilters,
  ): Promise<AdminOrdersListResponse> {
    return this.apiClient.get('admin/orders', { limit, offset, filters });
  }

  exportOrdersData({
    filters,
    offset,
    limit,
  }: {
    filters: OrderListFilters;
    offset: number;
    limit: number;
  }): Promise<AdminOrdersListResponse> {
    return this.apiClient.get('admin/orders/export', {
      filters,
      offset,
      limit,
    });
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
    filters?: Partial<RefProfile>,
  ): Promise<AdminPartnersListResponse> {
    return this.apiClient.get('admin/partners/list', {
      limit,
      offset,
      filters,
    });
  }

  createPartnerApiToken(): Promise<string> {
    return this.apiClient.get(`admin/partners/api-token`);
  }

  createPartner(data: RefProfile): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/partners`, data);
  }

  editPartner(data: RefProfile): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/partners/${data.id}`, data);
  }

  usersList({
    limit = 0,
    offset = 0,
    includeMoreDetailedInfo,
    filters,
  }: {
    limit: number;
    offset: number;
    includeMoreDetailedInfo?: boolean;
    filters?: {
      userOption?: string;
    };
  }): Promise<UsersListResponse> {
    return this.apiClient.get('admin/reg-users', {
      limit,
      offset,
      includeMoreDetailedInfo,
      filters,
    });
  }

  userDetails(id: string): Promise<UsersDetailsResponse> {
    return this.apiClient.get(`admin/reg-users/${id}`);
  }

  getDefaults(): Promise<AdminDefaults> {
    return this.apiClient.get(`admin/defaults`);
  }

  saveDefaults(data: AdminDefaults): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/defaults`, { data });
  }

  getFioApiUrlsList(
    limit: number,
    offset: number,
  ): Promise<AdminFioApiUrlsListResponse> {
    return this.apiClient.get('admin/api-urls', { limit, offset });
  }

  createFioApiUrl(data: { url: string }): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.post(`admin/api-urls`, data);
  }

  editFioApiUrl(data: {
    id: string;
    url: string;
  }): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.patch(`admin/api-urls/${data.id}`, data);
  }

  updateFioApiUrls(
    data: FioApiUrl[],
  ): Promise<AdminFioApiUrlsListUpdateResponse> {
    return this.apiClient.put(`admin/api-urls/list-update`, { data });
  }

  deleteFioApiUrl(data: { id: string }): Promise<AdminGeneralCreateResponse> {
    return this.apiClient.delete(`admin/api-urls/${data.id}`, {});
  }

  changeAdminPassword(data: {
    newPassword: string;
    oldPassword: string;
  }): Promise<AdminChangePasswordResponse> {
    return this.apiClient.put(`admin/change-password`, {
      data,
    });
  }

  changeAdmin2FA(data: {
    tfaSecret: string;
    tfaToken: string;
  }): Promise<AdminChange2Fa> {
    return this.apiClient.put(`admin/change-two-fa`, { data });
  }
}

import Base from './base';

import { FioWalletDoublet, RefProfileDomain, Nonce } from '../types';
import {
  AuthCheckRejectedResponse,
  AuthCreateNewDeviceRequestResponse,
  AuthDeleteNewDeviceRequestResponse,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthNonceResponse,
  AuthProfileResponse,
  AuthResendRecoveryResponse,
  AuthSetRecoveryResponse,
  AuthSignUpResponse,
  AuthUpdateEmailResponse,
  AuthUpdateNewDeviceResponse,
  AuthUsernameResponse,
  AdminAuthLoginResponse,
  AdminResetPasswordResponse,
  AuthProfileSendEvent,
  GenericStatusResponse,
  AuthGenerateNonceResponse,
} from './responses';

export default class Auth extends Base {
  profile(): Promise<AuthProfileResponse> {
    return this.apiClient.get('users/me');
  }

  username(email: string): Promise<AuthUsernameResponse> {
    return this.apiClient.get(`auth/username/${email}`);
  }

  login(data: {
    email: string;
    edgeWallets?: FioWalletDoublet[];
    signatures?: string[];
    challenge?: string;
    referrerCode?: string;
    timeZone?: string;
    username: string;
  }): Promise<AuthLoginResponse> {
    return this.apiClient.post('auth', data);
  }

  loginGuest(): Promise<AuthLoginResponse> {
    return this.apiClient.post('guest-auth', {});
  }

  alternateAuth(data: {
    derivationIndex: number;
    from: string;
    nonce: string;
    publicKey: string;
    signature: string;
    referrerCode?: string;
    timeZone?: string;
  }): Promise<AuthLoginResponse> {
    return this.apiClient.post('alternate-auth', { data });
  }

  nonce(username: string): Promise<AuthNonceResponse> {
    return this.apiClient.get('auth/nonce', { username });
  }

  userNonce(): Promise<AuthNonceResponse> {
    return this.apiClient.get('users/nonce');
  }

  generateNonce(): Promise<AuthGenerateNonceResponse> {
    return this.apiClient.get('auth/generate-nonce');
  }

  signup(data: {
    username: string;
    email: string;
    fioWallets: FioWalletDoublet[];
    refCode?: string;
    addEmailToPromoList: boolean;
  }): Promise<AuthSignUpResponse> {
    return this.apiClient.post('users', {
      data: { ...data, addEmailToPromoList: data.addEmailToPromoList ? 1 : 0 },
    });
  }

  setRecovery(token: string): Promise<AuthSetRecoveryResponse> {
    return this.apiClient.post('users/setRecovery', { data: { token } });
  }

  async logout(): Promise<AuthLogoutResponse> {
    this.apiClient.removeToken();
    return null;
  }

  resendRecovery(token: string): Promise<AuthResendRecoveryResponse> {
    return this.apiClient.post('users/resendRecovery', { data: { token } });
  }

  updateEmail({
    newEmail,
    newUsername,
    nonce,
  }: {
    newEmail: string;
    newUsername?: string;
    nonce: Nonce;
  }): Promise<AuthUpdateEmailResponse> {
    return this.apiClient.post('users/update-email', {
      data: { newEmail, newUsername, nonce },
    });
  }

  createNewDeviceRequest({
    email,
    voucherId,
    loginId,
    deviceDescription,
  }: {
    email: string;
    voucherId: string;
    loginId: string;
    deviceDescription: string;
  }): Promise<AuthCreateNewDeviceRequestResponse> {
    return this.apiClient.post('auth/new-device-two-factor', {
      data: { email, voucherId, loginId, deviceDescription },
    });
  }

  deleteNewDeviceRequest(
    voucherId: string,
  ): Promise<AuthDeleteNewDeviceRequestResponse> {
    return this.apiClient.delete('auth/new-device-two-factor', {
      voucherId,
    });
  }

  updateNewDevice({
    id,
    status,
    deviceDescription,
  }: {
    id: string;
    status?: string;
    deviceDescription?: string;
  }): Promise<AuthUpdateNewDeviceResponse> {
    return this.apiClient.put(`auth/new-device-two-factor/update/${id}`, {
      data: {
        status,
        deviceDescription,
      },
    });
  }

  checkRejected(voucherId: string): Promise<AuthCheckRejectedResponse> {
    return this.apiClient.get('/auth/new-device-two-factor/check-rejected', {
      voucherId,
    });
  }

  adminProfile(): Promise<AuthProfileResponse> {
    return this.apiClient.get('admin/me');
  }

  async adminLogout(): Promise<AuthLogoutResponse> {
    this.apiClient.removeAdminToken();
    return null;
  }

  adminLogin(
    email: string,
    password: string,
    tfaToken: string,
  ): Promise<AdminAuthLoginResponse> {
    return this.apiClient.post('admin-auth', {
      data: { email, password, tfaToken },
    });
  }

  confirmAdminByEmail(values: {
    email: string;
    hash: string;
    password: string;
    tfaToken: string;
    tfaSecret: string;
  }): Promise<AuthLoginResponse> {
    return this.apiClient.post('admin-auth/create', { data: { ...values } });
  }

  resetAdminPassword(values: {
    email: string;
    hash: string;
    password: string;
  }): Promise<AdminResetPasswordResponse> {
    return this.apiClient.post('admin-auth/reset-password', {
      data: { ...values },
    });
  }

  activateAffiliate(fch: string): Promise<AuthProfileResponse> {
    return this.apiClient.post('users/affiliate', {
      data: { fch },
    });
  }

  updateAffiliate(
    fch: string,
    domains: RefProfileDomain[],
  ): Promise<AuthProfileResponse> {
    return this.apiClient.patch('users/affiliate', {
      data: { fch, domains },
    });
  }

  sendEvent(event: string): Promise<AuthProfileSendEvent> {
    return this.apiClient.post('users/sendEvent', {
      event,
    });
  }

  deleteUser(nonce: Nonce): Promise<GenericStatusResponse> {
    return this.apiClient.delete('users/me', { nonce });
  }
}

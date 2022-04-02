import Base from './base';

import { EmailConfirmationStateData, FioWalletDoublet } from '../types';
import {
  AuthAvailableResponse,
  AuthCheckRejectedResponse,
  AuthConfirmResponse,
  AuthCreateNewDeviceRequestResponse,
  AuthDeleteNewDeviceRequestResponse,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthNonceResponse,
  AuthProfileResponse,
  AuthResendConfirmEmailResponse,
  AuthResendRecoveryResponse,
  AuthSetRecoveryResponse,
  AuthSignUpResponse,
  AuthUpdateEmailRequestResponse,
  AuthUpdateEmailRevertResponse,
  AuthUpdateNewDeviceResponse,
  AuthUsernameResponse,
} from './responses';

export default class Auth extends Base {
  profile(): Promise<AuthProfileResponse> {
    return this.apiClient.get('users/me');
  }

  username(email: string): Promise<AuthUsernameResponse> {
    return this.apiClient.get(`auth/username/${email}`);
  }

  login(
    email: string,
    signature: string,
    challenge: string,
    referrerCode?: string,
  ): Promise<AuthLoginResponse> {
    return this.apiClient.post('auth', {
      data: { email, signature, challenge, referrerCode },
    });
  }

  available(email: string): Promise<AuthAvailableResponse> {
    return this.apiClient.get(`users/available/${email}`);
  }

  nonce(username: string): Promise<AuthNonceResponse> {
    return this.apiClient.get('auth/nonce', { username });
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

  confirm(hash: string): Promise<AuthConfirmResponse> {
    return this.apiClient.post(`actions/${hash}`, {});
  }

  setRecovery(token: string): Promise<AuthSetRecoveryResponse> {
    return this.apiClient.post('users/setRecovery', { data: { token } });
  }

  async logout(): Promise<AuthLogoutResponse> {
    return null;
  }

  resendRecovery(token: string): Promise<AuthResendRecoveryResponse> {
    return this.apiClient.post('users/resendRecovery', { data: { token } });
  }

  resendConfirmEmail(
    token: string,
    stateData: EmailConfirmationStateData,
  ): Promise<AuthResendConfirmEmailResponse> {
    return this.apiClient.post('users/resendConfirmEmail', {
      data: { token, stateData },
    });
  }

  updateEmailRequest(
    oldEmail: string,
    newEmail: string,
  ): Promise<AuthUpdateEmailRequestResponse> {
    return this.apiClient.post('users/update-email-request', {
      data: { oldEmail, newEmail },
    });
  }

  updateEmailRevert(): Promise<AuthUpdateEmailRevertResponse> {
    return this.apiClient.post('users/update-email-revert', {});
  }

  createNewDeviceRequest({
    email,
    voucherId,
    deviceDescription,
  }: {
    email: string;
    voucherId: string;
    deviceDescription: string;
  }): Promise<AuthCreateNewDeviceRequestResponse> {
    return this.apiClient.post('auth/new-device-two-factor', {
      data: { email, voucherId, deviceDescription },
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
    voucherId,
    status,
    deviceDescription,
  }: {
    voucherId: string;
    status?: string;
    deviceDescription?: string;
  }): Promise<AuthUpdateNewDeviceResponse> {
    return this.apiClient.post(
      `auth/new-device-two-factor/update/${voucherId}`,
      {
        data: {
          status,
          deviceDescription,
        },
      },
    );
  }

  checkRejected(voucherId: string): Promise<AuthCheckRejectedResponse> {
    return this.apiClient.get('/auth/new-device-two-factor/check-rejected', {
      voucherId,
    });
  }
}

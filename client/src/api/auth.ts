import Base from './base';
import { EmailConfirmationStateData, FioWalletDoublet } from '../types';

export default class Auth extends Base {
  profile() {
    return this.apiClient.get('users/me');
  }

  username(email: string) {
    return this.apiClient.get(`auth/username/${email}`);
  }

  login(
    email: string,
    signature: string,
    challenge: string,
    referrerCode?: string,
  ) {
    return this.apiClient.post('auth', {
      data: { email, signature, challenge, referrerCode },
    });
  }

  available(email: string) {
    return this.apiClient.get(`users/available/${email}`);
  }

  nonce(username: string) {
    return this.apiClient.get('auth/nonce', { username });
  }

  signup(data: {
    username: string;
    email: string;
    fioWallets: FioWalletDoublet[];
    refCode?: string;
    addEmailToPromoList: boolean;
  }) {
    return this.apiClient.post('users', {
      data: { ...data, addEmailToPromoList: data.addEmailToPromoList ? 1 : 0 },
    });
  }

  confirm(hash: string) {
    return this.apiClient.post(`actions/${hash}`, {});
  }

  setRecovery(token: string) {
    return this.apiClient.post('users/setRecovery', { data: { token } });
  }

  async logout(): Promise<null> {
    return null;
  }

  resendRecovery(token: string) {
    return this.apiClient.post('users/resendRecovery', { data: { token } });
  }

  resendConfirmEmail(token: string, stateData: EmailConfirmationStateData) {
    return this.apiClient.post('users/resendConfirmEmail', {
      data: { token, stateData },
    });
  }

  updateEmailRequest(oldEmail: string, newEmail: string) {
    return this.apiClient.post('users/update-email-request', {
      data: { oldEmail, newEmail },
    });
  }

  updateEmailRevert() {
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
  }) {
    return this.apiClient.post('auth/new-device-two-factor', {
      data: { email, voucherId, deviceDescription },
    });
  }

  deleteNewDeviceRequest(voucherId: string) {
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
  }) {
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

  checkRejected(voucherId: string) {
    return this.apiClient.get('/auth/new-device-two-factor/check-rejected', {
      voucherId,
    });
  }
}

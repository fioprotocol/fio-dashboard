import Base from './base';

export default class Auth extends Base {
  profile() {
    return this.apiClient.get('users/me');
  }

  login(email, password) {
    return this.apiClient.post('auth', { data: { email, password } });
  }

  signup(data) {
    return this.apiClient.post('users', { data });
  }

  confirm(hash) {
    return this.apiClient.post(`actions/${hash}`);
  }

  resetPassword(email) {
    return this.apiClient.post('users/resetPassword', { data: { email } });
  }

  setPassword(hash, password, confirmPassword) {
    return this.apiClient.post(`actions/${hash}`, {
      data: { password, confirmPassword },
    });
  }

  async logout() {
    return null;
  }
}

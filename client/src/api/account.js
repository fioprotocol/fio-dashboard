import Base from './base';

export default class Account extends Base {
  getWallets() {
    return this.apiClient.get('account/wallets');
  }

  setWallets(fioWallets) {
    return this.apiClient.post('account/wallets', { data: fioWallets });
  }

  addWallet(data) {
    return this.apiClient.post('account/wallet', { data });
  }
}

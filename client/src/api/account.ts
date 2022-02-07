import Base from './base';
import { FioWalletDoublet, NewFioWalletDoublet } from '../types';

export default class Account extends Base {
  getWallets() {
    return this.apiClient.get('account/wallets');
  }

  setWallets(fioWallets: FioWalletDoublet[]) {
    return this.apiClient.post('account/wallets', { data: fioWallets });
  }

  addWallet(data: NewFioWalletDoublet) {
    return this.apiClient.post('account/wallet', { data });
  }

  updateWallet(publicKey: string, data: { name: string; data?: any }) {
    return this.apiClient.post(`account/wallet/update/${publicKey}`, { data });
  }

  validateWalletImport(publicKey: string) {
    return this.apiClient.post(
      `account/wallet/import/validate/${publicKey}`,
      {},
    );
  }
}

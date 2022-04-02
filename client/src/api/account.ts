import Base from './base';
import { FioWalletDoublet, NewFioWalletDoublet } from '../types';
import {
  AccountAddWalletsResponse,
  AccountGetWalletsResponse,
  AccountSetWalletsResponse,
  AccountUpdateWalletsResponse,
  AccountValidateWalletImportResponse,
} from './responses';

export default class Account extends Base {
  getWallets(): Promise<AccountGetWalletsResponse> {
    return this.apiClient.get('account/wallets');
  }

  setWallets(
    fioWallets: FioWalletDoublet[],
  ): Promise<AccountSetWalletsResponse> {
    return this.apiClient.post('account/wallets', { data: fioWallets });
  }

  addWallet(data: NewFioWalletDoublet): Promise<AccountAddWalletsResponse> {
    return this.apiClient.post('account/wallet', { data });
  }

  updateWallet(
    publicKey: string,
    data: { name: string; data?: { name?: string } },
  ): Promise<AccountUpdateWalletsResponse> {
    return this.apiClient.post(`account/wallet/update/${publicKey}`, { data });
  }

  validateWalletImport(
    publicKey: string,
  ): Promise<AccountValidateWalletImportResponse> {
    return this.apiClient.post(
      `account/wallet/import/validate/${publicKey}`,
      {},
    );
  }
}

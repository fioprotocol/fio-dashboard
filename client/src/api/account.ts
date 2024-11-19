import { FioSentItem } from '@fioprotocol/fiosdk';

import Base from './base';
import { FioWalletDoublet, NewFioWalletDoublet } from '../types';
import {
  AccountAddWalletsResponse,
  AccountGetWalletsResponse,
  AccountSetWalletsResponse,
  AccountUpdateWalletsResponse,
  AccountValidateWalletImportResponse,
  AccountDeleteWalletResponse,
  DefaultSuccessResponse,
} from './responses';

export default class Account extends Base {
  getWallets(): Promise<AccountGetWalletsResponse> {
    return this.apiClient.get('account/wallets');
  }

  setWallets(
    fioWallets: FioWalletDoublet[],
    archivedWalletIds?: string[],
  ): Promise<AccountSetWalletsResponse> {
    return this.apiClient.post('account/wallets', {
      data: fioWallets,
      archivedWalletIds,
    });
  }

  addWallet(data: NewFioWalletDoublet): Promise<AccountAddWalletsResponse> {
    return this.apiClient.post('account/wallet', { data });
  }

  addMissingWallet(data: {
    fioWallet: NewFioWalletDoublet;
    username: string;
  }): Promise<DefaultSuccessResponse> {
    return this.apiClient.post('account/add-missing-wallet', data);
  }

  updateWallet(
    publicKey: string,
    data: { name: string; data?: { name?: string } },
  ): Promise<AccountUpdateWalletsResponse> {
    return this.apiClient.post(`account/wallet/update/${publicKey}`, { data });
  }

  deleteWallet(publicKey: string): Promise<AccountDeleteWalletResponse> {
    return this.apiClient.delete(`account/wallet/${publicKey}`);
  }

  validateWalletImport(
    publicKey: string,
  ): Promise<AccountValidateWalletImportResponse> {
    return this.apiClient.post(
      `account/wallet/import/validate/${publicKey}`,
      {},
    );
  }

  getFioRequests(): Promise<{
    [key: string]: {
      sent: FioSentItem[];
      received: FioSentItem[];
    };
  }> {
    return this.apiClient.get('account/wallet/fio-requests');
  }
}

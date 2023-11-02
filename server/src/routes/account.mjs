import { makeServiceRunner } from '../tools';

import WalletsList from '../services/wallets/List';
import WalletsUpdateList from '../services/wallets/UpdateList';
import WalletsAdd from '../services/wallets/Add';
import WalletsAddMissing from '../services/wallets/AddMissing.mjs';
import WalletsUpdate from '../services/wallets/Update';
import WalletsDelete from '../services/wallets/Delete';
import WalletsImportValidate from '../services/wallets/ImportValidate';

export default {
  walletsList: makeServiceRunner(WalletsList),
  setWallets: makeServiceRunner(WalletsUpdateList, req => req.body),
  addWallet: makeServiceRunner(WalletsAdd, req => req.body),
  addMissingWallet: makeServiceRunner(WalletsAddMissing, req => req.body),
  editWallet: makeServiceRunner(WalletsUpdate, req => ({
    ...req.params,
    ...req.body.data,
  })),
  deleteWallet: makeServiceRunner(WalletsDelete, req => ({
    ...req.params,
    ...req.body.data,
  })),
  importValidateWallet: makeServiceRunner(WalletsImportValidate, req => req.params),
};

import { makeServiceRunner } from '../tools';

import WalletsList from '../services/wallets/List';
import WalletsUpdateList from '../services/wallets/UpdateList';
import WalletsAdd from '../services/wallets/Add';
import WalletsUpdate from '../services/wallets/Update';

export default {
  walletsList: makeServiceRunner(WalletsList),
  setWallets: makeServiceRunner(WalletsUpdateList, req => req.body),
  addWallet: makeServiceRunner(WalletsAdd, req => req.body),
  editWallet: makeServiceRunner(WalletsUpdate, req => ({
    ...req.params,
    ...req.body.data,
  })),
};

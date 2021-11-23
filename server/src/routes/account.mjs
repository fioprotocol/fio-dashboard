import { makeServiceRunner } from '../tools';

import WalletsList from '../services/wallets/List';
import WalletsUpdate from '../services/wallets/Update';
import WalletsAdd from '../services/wallets/Add';

export default {
  walletsList: makeServiceRunner(WalletsList),
  setWallets: makeServiceRunner(WalletsUpdate, req => req.body),
  addWallet: makeServiceRunner(WalletsAdd, req => req.body),
};

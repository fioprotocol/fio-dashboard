import { makeServiceRunner } from '../tools';

import WalletsList from '../services/wallets/List';
import WalletsUpdate from '../services/wallets/Update';

export default {
  walletsList: makeServiceRunner(WalletsList),
  setWallets: makeServiceRunner(WalletsUpdate, req => req.body),
};

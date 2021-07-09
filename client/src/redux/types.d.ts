import { LOGIN_SUCCESS } from './edge/actions';
import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

export type Action = {
  type: LOGIN_SUCCESS;
  data: {
    account: EdgeAccount;
    fioWallets: EdgeCurrencyWallet[];
  };
};

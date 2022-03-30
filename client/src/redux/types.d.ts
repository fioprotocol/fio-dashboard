import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

import { LOGIN_SUCCESS } from './edge/actions';

export type Action = {
  type: LOGIN_SUCCESS;
  data: {
    account: EdgeAccount;
    fioWallets: EdgeCurrencyWallet[];
    options?: { otpKey?: string };
    voucherId?: string;
  };
};

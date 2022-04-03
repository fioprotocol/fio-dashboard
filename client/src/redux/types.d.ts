import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

import { LOGIN_SUCCESS } from './edge/actions';
import { LOGIN_SUCCESS as PROFILE_LOGIN_SUCCESS } from './profile/actions';
import { FioWalletDoublet } from '../types';

// todo: set all actions types

type GetFeeAction = { data: { fee: number }; type: string; endpoint: string };
type PricesAction = { data: { pricing: { usdtRoe: number } }; type: string };

export type Action = {
  type: LOGIN_SUCCESS;
  data: {
    account: EdgeAccount;
    fioWallets: EdgeCurrencyWallet[];
    options?: { otpKey?: string };
    voucherId?: string;
  };
} & {
  type: PROFILE_LOGIN_SUCCESS;
  data: {
    jwt: string;
    emailConfirmationToken?: string;
  };
  otpKey?: string;
  voucherId?: number;
} & {
  type: string;
  data: FioWalletDoublet;
} & {
  error: string & { code: string; fields: { [field: string]: any } };
} & GetFeeAction &
  PricesAction &
  any;

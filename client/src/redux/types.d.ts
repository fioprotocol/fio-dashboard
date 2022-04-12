import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

import { LOGIN_SUCCESS } from './edge/actions';
import { LOGIN_SUCCESS as PROFILE_LOGIN_SUCCESS } from './profile/actions';
import { AnyType, AnyObject, FioWalletDoublet } from '../types';
import { Api } from '../api';
import { FIO_SIGN_NFT_SUCCESS } from './fio/actions';
import { GetState } from './init';

// todo: set all actions types

type GetFeeAction = { data: { fee: number }; type: string; endpoint: string };
type PricesAction = { data: { pricing: { usdtRoe: number } }; type: string };
type CommonPromiseAction = {
  promise: (api: Api, getState: GetState) => Promise<AnyObject>;
  types: string[];
} & AnyObject;
type CommonAction = {
  data?: AnyType;
  type: string;
} & AnyObject;

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
  type: FIO_SIGN_NFT_SUCCESS;
  data: {
    transaction_id: string;
  };
} & {
  type: string;
  data: FioWalletDoublet;
} & {
  error: string & { code: string; fields: { [field: string]: AnyType } };
} & GetFeeAction &
  PricesAction &
  CommonPromiseAction &
  CommonAction &
  any;

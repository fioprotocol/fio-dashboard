import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

import { LOGIN_SUCCESS } from './edge/actions';
import { LOGIN_SUCCESS as PROFILE_LOGIN_SUCCESS } from './profile/actions';
import {
  FIO_ACTION_EXECUTE_SUCCESS,
  FIO_SIGN_NFT_SUCCESS,
} from './fio/actions';
import { SET_STEP } from './containedFlow/actions';

import { Api } from '../api';
import { GetState } from './init';

import {
  AnyType,
  AnyObject,
  FioWalletDoublet,
  FioActionExecuted,
  PaymentProvider,
  NativePrices,
} from '../types';

// todo: set all actions types

export type CreateOrderActionData = {
  cartId: string;
  roe: number;
  publicKey: string;
  paymentProcessor?: PaymentProvider;
  prices: NativePrices;
  data: {
    gaClientId: string | null;
    gaSessionId: string | null;
  };
  refProfileId?: string;
};
type GetFeeAction = { data: { fee: number }; type: string; endpoint: string };
type PricesAction = { data: { pricing: { usdtRoe: number } }; type: string };
type ContainedFlowAction = {
  type: FIO_ACTION_EXECUTE_SUCCESS;
  data: FioActionExecuted;
};
type ContainedFlowSteps = {
  type: SET_STEP;
  containedFlowAction: string;
  redirectUrl: string;
};

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
  ContainedFlowAction &
  ContainedFlowSteps &
  AnyType;

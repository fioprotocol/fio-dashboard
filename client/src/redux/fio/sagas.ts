import { put, select, takeEvery } from 'redux-saga/effects';

import {
  setFees,
  refreshBalance,
  setBalances,
  GET_FEE_SUCCESS,
  REFRESH_BALANCE_SUCCESS,
} from './actions';
import { ADD_WALLET_SUCCESS } from '../account/actions';
import { PRICES_SUCCESS } from '../registrations/actions';

import {
  fees as feesSelector,
  fioWalletsBalances as balancesSelector,
} from './selectors';
import { roe as roeSelector } from '../registrations/selectors';

import {
  convertFioPrices,
  calculateBalances,
  calculateTotalBalances,
  DEFAULT_BALANCES,
} from '../../util/prices';

import {
  FeePrice,
  FioBalanceRes,
  FioWalletDoublet,
  WalletsBalances,
} from '../../types';

type GetFeeAction = { data: { fee: number }; type: string; endpoint: string };
type PricesAction = { data: { pricing: { usdtRoe: number } }; type: string };
type RefreshBalanceAction = {
  data: FioBalanceRes;
  type: string;
  publicKey: string;
};

export function* addFioWalletSuccess() {
  yield takeEvery(ADD_WALLET_SUCCESS, function*(action: {
    type: string;
    data: FioWalletDoublet;
  }) {
    const { publicKey } = action.data;
    // @ts-ignore
    yield put(refreshBalance(publicKey));
  });
}

export function* setFeesService() {
  yield takeEvery(GET_FEE_SUCCESS, function*(action: GetFeeAction) {
    const {
      endpoint,
      data: { fee },
    } = action;
    // @ts-ignore todo: fix for all generators in the file
    const fees = yield select(feesSelector);
    // @ts-ignore
    const roe = yield select(roeSelector);

    fees[endpoint] = convertFioPrices(fee, roe);
    // @ts-ignore
    yield put(setFees(fees));
  });
  yield takeEvery(PRICES_SUCCESS, function*(action: PricesAction) {
    const {
      pricing: { usdtRoe },
    } = action.data;
    // @ts-ignore
    const fees = yield select(feesSelector);
    const recalculatedFees: { [endpoint: string]: FeePrice } = {};

    for (const endpoint in fees) {
      if (endpoint == null) continue;
      recalculatedFees[endpoint] = convertFioPrices(
        fees[endpoint].nativeFio,
        usdtRoe,
      );
    }
    // @ts-ignore
    yield put(setFees(recalculatedFees));
  });
}

export function* setBalancesService() {
  yield takeEvery(REFRESH_BALANCE_SUCCESS, function*(
    action: RefreshBalanceAction,
  ) {
    const { publicKey, data } = action;
    // @ts-ignore
    const walletsBalances = yield select(balancesSelector);
    // @ts-ignore
    const roe = yield select(roeSelector);

    const recalculatedBalances = { ...walletsBalances };
    recalculatedBalances.wallets[publicKey] = calculateBalances(data, roe);

    recalculatedBalances.total = calculateTotalBalances(
      recalculatedBalances.wallets,
      roe,
    );

    // @ts-ignore
    yield put(setBalances(recalculatedBalances));
  });
  yield takeEvery(PRICES_SUCCESS, function*(action: PricesAction) {
    const {
      pricing: { usdtRoe: roe },
    } = action.data;
    // @ts-ignore
    const walletsBalances = yield select(balancesSelector);

    const recalculatedBalances: WalletsBalances = {
      total: DEFAULT_BALANCES,
      wallets: {},
    };

    for (const publicKey in walletsBalances.wallets) {
      if (publicKey == null) continue;
      recalculatedBalances.wallets[publicKey] = calculateBalances(
        {
          balance: walletsBalances.wallets[publicKey].total.nativeFio,
          available: walletsBalances.wallets[publicKey].available.nativeFio,
          locked: walletsBalances.wallets[publicKey].locked.nativeFio,
          staked: walletsBalances.wallets[publicKey].staked.nativeFio,
          rewards: walletsBalances.wallets[publicKey].rewards.nativeFio,
          unlockPeriods: [],
        },
        roe,
      );
    }
    recalculatedBalances.total = calculateTotalBalances(
      recalculatedBalances.wallets,
      roe,
    );

    // @ts-ignore
    yield put(setBalances(recalculatedBalances));
  });
}

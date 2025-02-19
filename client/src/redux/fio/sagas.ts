import { put, select, takeEvery } from 'redux-saga/effects';

import {
  GET_FEE_SUCCESS,
  GET_ORACLE_FEES_SUCCESS,
  REFRESH_BALANCE_SUCCESS,
  refreshBalance,
  setBalances,
  setFees,
  setOracleFees,
} from './actions';
import { ADD_WALLET_SUCCESS } from '../account/actions';
import { PRICES_SUCCESS } from '../registrations/actions';

import {
  fees as feesSelector,
  fioWalletsBalances as balancesSelector,
} from './selectors';
import { roe as roeSelector } from '../registrations/selectors';

import {
  calculateBalances,
  calculateTotalBalances,
  convertFioPrices,
  DEFAULT_BALANCES,
} from '../../util/prices';

import {
  FeePrice,
  FioBalanceRes,
  OracleFees,
  Roe,
  WalletsBalances,
} from '../../types';
import { Action } from '../types';

type RefreshBalanceAction = {
  data: FioBalanceRes;
  type: string;
  publicKey: string;
};

export function* addFioWalletSuccess(): Generator {
  yield takeEvery(ADD_WALLET_SUCCESS, function*(action: Action) {
    const { publicKey } = action.data;
    yield put<Action>(refreshBalance(publicKey));
  });
}

export function* setFeesService(): Generator {
  yield takeEvery(GET_ORACLE_FEES_SUCCESS, function*(action: Action) {
    const {
      data: { oracle_fees },
    } = action;
    const fees = {} as OracleFees;
    const roe: Roe = yield select(roeSelector);

    if (oracle_fees?.length) {
      oracle_fees.forEach(
        (el: {
          fee_name: 'wrap_fio_tokens' | 'wrap_fio_domain';
          fee_amount: string;
        }) => {
          fees[el.fee_name] = convertFioPrices(el.fee_amount, roe);
        },
      );
    }
    yield put(setOracleFees(fees));
  });

  yield takeEvery(GET_FEE_SUCCESS, function*(action: Action) {
    const {
      endpoint,
      data: { fee },
    } = action;
    const fees: { [endpoint: string]: FeePrice } = yield select(feesSelector);
    const roe: Roe = yield select(roeSelector);

    fees[endpoint] = convertFioPrices(fee, roe);
    yield put(setFees(fees));
  });

  yield takeEvery(PRICES_SUCCESS, function*(action: Action) {
    const {
      pricing: { usdtRoe },
    } = action.data;
    const fees: { [endpoint: string]: FeePrice } = yield select(feesSelector);
    const recalculatedFees: { [endpoint: string]: FeePrice } = {};

    for (const endpoint in fees) {
      if (endpoint == null) continue;
      recalculatedFees[endpoint] = convertFioPrices(
        fees[endpoint].nativeFio,
        usdtRoe,
      );
    }
    yield put(setFees(recalculatedFees));
  });
}

export function* setBalancesService(): Generator {
  yield takeEvery(REFRESH_BALANCE_SUCCESS, function*(
    action: RefreshBalanceAction,
  ) {
    const { publicKey, data } = action;

    const walletsBalances: WalletsBalances = yield select(balancesSelector);

    const roe: Roe = yield select(roeSelector);

    const recalculatedBalances = { ...walletsBalances };
    recalculatedBalances.wallets[publicKey] = calculateBalances(data, roe);

    recalculatedBalances.total = calculateTotalBalances(
      recalculatedBalances.wallets,
      roe,
    );

    yield put(setBalances(recalculatedBalances));
  });
  yield takeEvery(PRICES_SUCCESS, function*(action: Action) {
    const {
      pricing: { usdtRoe: roe },
    } = action.data;

    const walletsBalances: WalletsBalances = yield select(balancesSelector);

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

    yield put(setBalances(recalculatedBalances));
  });
}

import { put, select, takeEvery } from 'redux-saga/effects';

import { setFees, GET_FEE_SUCCESS } from './actions';
import { PRICES_SUCCESS } from '../registrations/actions';

import { fees as feesSelector } from './selectors';
import { roe as roeSelector } from '../registrations/selectors';

import { setFees as calculateFeeValues } from '../../util/prices';

import { FeePrice } from '../../types';

type GetFeeAction = { data: { fee: number }; type: string; endpoint: string };
type PricesAction = { data: { pricing: { usdtRoe: number } }; type: string };

export function* setFeesService() {
  yield takeEvery(GET_FEE_SUCCESS, function*(action: GetFeeAction) {
    const {
      endpoint,
      data: { fee },
    } = action;
    const fees = yield select(feesSelector);
    const roe = yield select(roeSelector);

    fees[endpoint] = calculateFeeValues(fee, roe);
    // @ts-ignore
    yield put(setFees(fees));
  });
  yield takeEvery(PRICES_SUCCESS, function*(action: PricesAction) {
    const {
      pricing: { usdtRoe },
    } = action.data;
    const fees = yield select(feesSelector);
    const recalculatedFees: { [endpoint: string]: FeePrice } = {};

    for (const endpoint in fees) {
      recalculatedFees[endpoint] = calculateFeeValues(
        fees[endpoint].nativeFio,
        usdtRoe,
      );
    }
    // @ts-ignore
    yield put(setFees(recalculatedFees));
  });
}

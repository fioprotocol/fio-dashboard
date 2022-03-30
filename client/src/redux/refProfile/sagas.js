import { put, takeEvery, select } from 'redux-saga/effects';

import { REF_FLOW_STEPS } from '../../constants/common';
import { setStep } from './actions';
import { LOGIN_SUCCESS } from '../profile/actions';
import { FIO_SIGN_NFT_SUCCESS } from '../fio/actions';
import { SET_REGISTRATION_RESULTS } from '../registrations/actions';
import { isRefFlow as getIsRefFlow, refProfileQueryParams } from './selectors';

export function* refLoginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*() {
    const isRefFlow = yield select(getIsRefFlow);
    if (isRefFlow) {
      yield put(setStep(REF_FLOW_STEPS.REGISTRATION));
    }
  });
}

export function* fioAddressRegisterSuccess() {
  yield takeEvery(SET_REGISTRATION_RESULTS, function*(action) {
    const isRefFlow = yield select(getIsRefFlow);
    if (isRefFlow && action.data.success) {
      yield put(setStep(REF_FLOW_STEPS.ACTION));
    }
  });
}

export function* refActionSuccess() {
  yield takeEvery(FIO_SIGN_NFT_SUCCESS, function*(action) {
    const isRefFlow = yield select(getIsRefFlow);
    if (isRefFlow && action.data.status) {
      const { r } = yield select(refProfileQueryParams);
      const redirectUrl = `${r}?txId=${action.data.transaction_id}`;
      yield put(setStep(REF_FLOW_STEPS.FINISH));
      window.location.replace(redirectUrl);
    }
  });
}

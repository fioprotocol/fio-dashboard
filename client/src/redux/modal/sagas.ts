import { put, takeEvery } from 'redux-saga/effects';

import {
  CLOSE_GENERIC_ERROR_MODAL,
  clearGenericErrorData,
  CLOSE_GENERIC_SUCCESS_MODAL,
  clearGenericSuccessData,
} from './actions';
import { sleep } from '../../utils';

export function* clearGenericModalError(): Generator {
  yield takeEvery(CLOSE_GENERIC_ERROR_MODAL, async function*() {
    await sleep(1000); // avoid text blinking on modal close animation
    yield put(clearGenericErrorData());
  });
}

export function* clearGenericModalSuccess(): Generator {
  yield takeEvery(CLOSE_GENERIC_SUCCESS_MODAL, async function*() {
    await sleep(1000); // avoid text blinking on modal close animation
    yield put(clearGenericSuccessData());
  });
}

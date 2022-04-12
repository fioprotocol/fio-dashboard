import { put, takeEvery } from 'redux-saga/effects';

import { CLOSE_GENERIC_ERROR_MODAL, clearGenericErrorData } from './actions';
import { sleep } from '../../utils';

export function* clearGenericModalError(): Generator {
  yield takeEvery(CLOSE_GENERIC_ERROR_MODAL, async function*() {
    await sleep(1000); // avoid text blinking on modal close animation
    yield put(clearGenericErrorData());
  });
}

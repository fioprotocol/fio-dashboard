import { takeEvery } from 'redux-saga/effects';
import { LIST_FAILURE } from './actions';

import { ROUTES } from '../../constants/routes';

export function* listFailure(history) {
  yield takeEvery(LIST_FAILURE, function*(action) {
    if (action.error && action.error.code === 'PERMISSION_DENIED') {
      yield history.push(ROUTES.HOME);
    }
  });
}

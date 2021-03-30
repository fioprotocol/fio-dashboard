import { all } from 'redux-saga/effects';

import {
  loginSuccess,
  signupSuccess,
  logoutSuccess,
  setRecoverySuccess,
} from './profile/sagas';
import {
  loginSuccess as loginEdgeSuccess,
  logoutSuccess as logoutEdgeSuccess,
} from './edge/sagas';
import { listFailure } from './users/sagas';
import { notify } from './notify/sagas';

export default function* rootSaga(history, api) {
  yield all([
    loginSuccess(history, api),
    logoutSuccess(history, api),
    loginEdgeSuccess(),
    logoutEdgeSuccess(),
    listFailure(history),
    signupSuccess(history),
    setRecoverySuccess(),
    notify(),
  ]);
}

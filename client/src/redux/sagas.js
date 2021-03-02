import { all } from 'redux-saga/effects';

import {
  loginSuccess,
  signupSuccess,
  logoutSuccess,
  accountSuccess,
} from './profile/sagas';
import { listFailure } from './users/sagas';
import { notify } from './notify/sagas';

export default function* rootSaga(history, api) {
  yield all([
    loginSuccess(history, api),
    logoutSuccess(history, api),
    accountSuccess(history, api),
    listFailure(history),
    signupSuccess(history),
    notify(),
  ]);
}

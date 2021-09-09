import { all } from 'redux-saga/effects';

import {
  loginSuccess,
  signupSuccess,
  logoutSuccess,
  profileSuccess,
  nonceSuccess,
} from './profile/sagas';
import { edgeLoginSuccess } from './edge/sagas';
import { listFailure } from './users/sagas';
import { notify } from './notify/sagas';
import { fioAddressRegisterSuccess, refLoginSuccess } from './refProfile/sagas';

export default function* rootSaga(history, api) {
  yield all([
    loginSuccess(history, api),
    logoutSuccess(history, api),
    profileSuccess(),
    nonceSuccess(),
    edgeLoginSuccess(),
    listFailure(history),
    signupSuccess(history),
    notify(history),
    fioAddressRegisterSuccess(history),
    refLoginSuccess(),
  ]);
}

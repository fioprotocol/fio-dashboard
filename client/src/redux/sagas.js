import { all } from 'redux-saga/effects';

import {
  loginSuccess,
  loginFailure,
  signupSuccess,
  logoutSuccess,
  profileSuccess,
  nonceSuccess,
} from './profile/sagas';
import { edgeLoginSuccess } from './edge/sagas';
import { listFailure } from './users/sagas';
import { notify } from './notify/sagas';
import {
  fioAddressRegisterSuccess,
  refLoginSuccess,
  refActionSuccess,
} from './refProfile/sagas';
import { clearGenericModalError } from './modal/sagas';

export default function* rootSaga(history, api) {
  yield all([
    loginSuccess(history, api),
    loginFailure(history, api),
    logoutSuccess(history, api),
    profileSuccess(),
    nonceSuccess(),
    edgeLoginSuccess(),
    listFailure(history),
    signupSuccess(history),
    notify(history),
    fioAddressRegisterSuccess(history),
    refLoginSuccess(),
    clearGenericModalError(),
    refActionSuccess(),
  ]);
}

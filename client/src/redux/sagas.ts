import { History } from 'history';
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
import {
  fioAddressRegisterSuccess,
  refLoginSuccess,
  refActionSuccess,
} from './refProfile/sagas';
import { clearGenericModalError } from './modal/sagas';
import {
  addFioWalletSuccess,
  setFeesService,
  setBalancesService,
} from './fio/sagas';

import { Api } from '../api';

export default function* rootSaga(history: History, api: Api) {
  yield all([
    loginSuccess(history, api),
    logoutSuccess(history, api),
    profileSuccess(),
    nonceSuccess(),
    edgeLoginSuccess(),
    listFailure(history),
    signupSuccess(),
    notify(history),
    fioAddressRegisterSuccess(),
    refLoginSuccess(),
    clearGenericModalError(),
    refActionSuccess(),
    setFeesService(),
    addFioWalletSuccess(),
    setBalancesService(),
  ]);
}

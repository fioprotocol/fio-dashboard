import { History } from 'history';
import { all } from 'redux-saga/effects';

import {
  loginSuccess,
  logoutSuccess,
  profileSuccess,
  nonceSuccess,
} from './profile/sagas';
import { edgeLoginSuccess } from './edge/sagas';
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function* rootSaga(history: History, api: Api) {
  yield all([
    loginSuccess(history, api),
    logoutSuccess(history, api),
    profileSuccess(),
    nonceSuccess(),
    edgeLoginSuccess(),
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

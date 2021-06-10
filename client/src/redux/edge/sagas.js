import { put, takeEvery } from 'redux-saga/effects';
import { usernameToEmail } from '../../utils';
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REFRESH_FIO_WALLETS_SUCCESS,
  refreshFioWallets,
} from './actions';
import { login, logout } from '../profile/actions';
import { refreshBalance } from '../fio/actions';

export function* loginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    const account = action.data;
    yield put(refreshFioWallets(account));
    yield put(
      login({ email: usernameToEmail(account.username), password: account.id }),
    );
  });
}
export function* logoutSuccess() {
  yield takeEvery(LOGOUT_SUCCESS, function*() {
    yield put(logout());
  });
}

export function* refreshFioWalletsSuccess() {
  yield takeEvery(REFRESH_FIO_WALLETS_SUCCESS, function*(action) {
    const fioWallets = action.data;

    for (const fioWallet of fioWallets) {
      yield put(refreshBalance(fioWallet.publicWalletInfo.keys.publicKey));
    }
  });
}

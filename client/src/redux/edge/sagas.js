import { put, takeEvery } from 'redux-saga/effects';
import { usernameToEmail } from '../../utils';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS, refreshFioWallets } from './actions';
import { login, logout } from '../profile/actions';

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

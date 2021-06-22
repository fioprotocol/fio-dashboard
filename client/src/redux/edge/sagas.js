import { put, takeEvery } from 'redux-saga/effects';
import { usernameToEmail } from '../../utils';
import { LOGIN_SUCCESS } from './actions';
import { login } from '../profile/actions';
import { refreshBalance } from '../fio/actions';
import { logout } from './actions';

export function* edgeLoginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    const { account, fioWallets } = action.data;
    const loginInfo = {
      email: usernameToEmail(account.username),
      password: account.id,
    };
    for (const fioWallet of fioWallets) {
      yield put(refreshBalance(fioWallet.getDisplayPublicSeed()));
    }
    yield put(logout(account));
    yield put(
      login(
        loginInfo,
        fioWallets.map(fioWallet => ({
          id: fioWallet.id,
          name: fioWallet.name,
          publicKey: fioWallet.getDisplayPublicSeed(),
        })),
      ),
    );
  });
}

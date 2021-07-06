import { put, takeEvery } from 'redux-saga/effects';
import { usernameToEmail } from '../../utils';
import { LOGIN_SUCCESS } from './actions';
import { nonce } from '../profile/actions';
import { refreshBalance } from '../fio/actions';
import { logout } from './actions';

export function* edgeLoginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    const { account, fioWallets } = action.data;
    const keys = {};
    for (const fioWallet of fioWallets) {
      keys[fioWallet.id] = {
        private: fioWallet.keys.fioKey,
        public: fioWallet.getDisplayPublicSeed(),
      };
      yield put(refreshBalance(keys[fioWallet.id].public));
    }
    yield put(logout(account));
    yield put(nonce(usernameToEmail(account.username), keys));
  });
}

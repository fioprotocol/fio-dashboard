import { put, takeEvery } from 'redux-saga/effects';
import { getWalletKeys } from '../../utils';
import { LOGIN_SUCCESS } from './actions';
import { nonce } from '../profile/actions';
import { refreshBalance } from '../fio/actions';
import { logout } from './actions';

export function* edgeLoginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    const { account, fioWallets } = action.data;
    const keys = getWalletKeys(fioWallets);
    for (const fioWallet of fioWallets) {
      yield put(refreshBalance(keys[fioWallet.id].public));
    }
    yield put(logout(account));
    yield put(nonce(account.username, keys));
  });
}

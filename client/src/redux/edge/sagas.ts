import { put, takeEvery } from 'redux-saga/effects';
import { getWalletKeys } from '../../utils';
import { LOGIN_SUCCESS } from './actions';
import { nonce } from '../profile/actions';
import { refreshBalance } from '../fio/actions';
import { logout } from './actions';
import { Action } from '../types';

export function* edgeLoginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*(action: Action) {
    const { account, fioWallets, options, voucherId } = action.data;
    const keys = getWalletKeys(fioWallets);
    for (const fioWallet of fioWallets) {
      // @ts-ignore todo: custom dispatch?
      yield put(refreshBalance(keys[fioWallet.id].public));
    }
    // @ts-ignore
    yield put(logout(account));

    yield put(
      // @ts-ignore
      nonce(account.username, keys, options && options.otpKey, voucherId),
    );
  });
}

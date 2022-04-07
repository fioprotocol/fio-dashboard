import { put, takeEvery } from 'redux-saga/effects';

import { getWalletKeys } from '../../utils';
import { LOGIN_SUCCESS } from './actions';
import { makeNonce } from '../profile/actions';
import { refreshBalance } from '../fio/actions';
import { logout } from './actions';
import { Action } from '../types';

export function* edgeLoginSuccess() {
  yield takeEvery(LOGIN_SUCCESS, function*(action: Action) {
    const { account, fioWallets, options, voucherId } = action.data;
    const keys = getWalletKeys(fioWallets);
    for (const fioWallet of fioWallets) {
      yield put<Action>(refreshBalance(keys[fioWallet.id].public));
    }
    yield put<Action>(logout(account));

    yield put<
      Action
    >(makeNonce(account.username, keys, options && options.otpKey, voucherId));
  });
}

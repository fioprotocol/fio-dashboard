import { put, select, takeEvery } from 'redux-saga/effects';

import { LOGIN_SUCCESS, setConfirmPinKeys } from './actions';
import { makeNonce } from '../profile/actions';
import { refreshBalance } from '../fio/actions';
import { logout } from './actions';

import { locationState as locationStateSelector } from '../navigation/selectors';

import { getWalletKeys } from '../../utils';

import { Action } from '../types';
import { PrivateRedirectLocationState } from '../../types';

export function* edgeLoginSuccess(): Generator {
  yield takeEvery(LOGIN_SUCCESS, function*(action: Action) {
    const { account, fioWallets, options, voucherId } = action.data;
    const keys = getWalletKeys(fioWallets);
    for (const fioWallet of fioWallets) {
      yield put<Action>(refreshBalance(keys[fioWallet.id].public));
    }
    yield put<Action>(logout(account));

    const locationState: PrivateRedirectLocationState = yield select(
      locationStateSelector,
    );
    if (
      locationState &&
      locationState.options &&
      locationState.options.setKeysForAction
    ) {
      yield put<Action>(setConfirmPinKeys(keys));
    }

    yield put<
      Action
    >(makeNonce(account.username, keys, options && options.otpKey, voucherId));
  });
}

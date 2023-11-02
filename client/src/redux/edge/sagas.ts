import { put, select, takeEvery } from 'redux-saga/effects';
import { EdgeCurrencyWallet } from 'edge-core-js';

import {
  CHANGE_PIN_SUCCESS,
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  setConfirmPinKeys,
  setPinEnabled,
} from './actions';
import { makeNonce } from '../profile/actions';
import { refreshBalance } from '../fio/actions';
import { logout } from './actions';

import { locationState as locationStateSelector } from '../navigation/selectors';

import { getWalletKeys } from '../../utils';
import { log } from '../../util/general';
import apis from '../../api';

import { Action } from '../types';
import { PrivateRedirectLocationState } from '../../types';
import {
  DEFAULT_WALLET_OPTIONS,
  FIO_WALLET_TYPE,
  WALLET_CREATED_FROM,
} from '../../constants/common';

export function* edgeLoginSuccess(): Generator {
  yield takeEvery(LOGIN_SUCCESS, function*(action: Action) {
    const { account, fioWallets, options, voucherId, isPinLogin } = action.data;

    try {
      if (!fioWallets.length) {
        const createdWallet: EdgeCurrencyWallet = yield account.createCurrencyWallet(
          FIO_WALLET_TYPE,
          DEFAULT_WALLET_OPTIONS,
        );
        yield createdWallet.renameWallet(DEFAULT_WALLET_OPTIONS.name);
        fioWallets.push(createdWallet);
        yield apis.account.addMissingWallet({
          fioWallet: {
            edgeId: createdWallet.id,
            name: `${DEFAULT_WALLET_OPTIONS.name} 1`,
            publicKey: createdWallet.publicWalletInfo.keys.publicKey,
            from: WALLET_CREATED_FROM.EDGE,
          },
          username: account.username,
        });
      }
    } catch (error) {
      yield log.error(error);
    }

    const keys = getWalletKeys(fioWallets);
    for (const fioWallet of fioWallets) {
      yield put<Action>(refreshBalance(keys[fioWallet.id].public));
    }
    yield put<Action>(logout(account));

    yield put<Action>(setPinEnabled(account.username));

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

    const edgeCurrencyWallets: EdgeCurrencyWallet[] = [...fioWallets];

    const edgeWallets = edgeCurrencyWallets.map((fioWallet, i) => ({
      id: null,
      edgeId: fioWallet.id,
      name: `${DEFAULT_WALLET_OPTIONS.name} ${i + 1}`,
      publicKey: fioWallet.publicWalletInfo.keys.publicKey,
      from: WALLET_CREATED_FROM.EDGE,
    }));

    yield put<
      Action
    >(makeNonce({ username: account.username, edgeWallets, keys, otpKey: options?.otpKey, voucherId, isPinLogin }));
  });
}

export function* edgePinUpdateSuccess(): Generator {
  yield takeEvery([CHANGE_PIN_SUCCESS, SIGNUP_SUCCESS], function*(
    action: Action,
  ) {
    const { username } = action;

    if (username) {
      yield put<Action>(setPinEnabled(username));
    }
  });
}

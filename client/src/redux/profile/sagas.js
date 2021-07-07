import { put, takeEvery, select } from 'redux-saga/effects';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { setWallets } from '../account/actions';
import { refreshBalance } from '../fio/actions';
import {
  LOGIN_SUCCESS,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
  SET_RECOVERY_SUCCESS,
  NONCE_SUCCESS,
  loadProfile,
  login,
} from './actions';

import { closeRecoveryModal, closeLoginModal } from '../modal/actions';
import {
  listNotifications,
  createNotification,
} from '../notifications/actions';
import { setRedirectPath } from '../router/actions';

import { hasRedirect } from '../router/selectors';
import { fioWallets } from '../fio/selectors';
import { ROUTES } from '../../constants/routes';

export function* loginSuccess(history, api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    const hasRedirectTo = yield select(hasRedirect);
    const wallets = yield select(fioWallets);
    api.client.setToken(action.data.jwt);
    if (wallets && wallets.length) yield put(setWallets(wallets));
    yield put(loadProfile());
    yield put(listNotifications());
    const currentLocation = history.location.pathname;
    if (currentLocation === '/') yield history.push(ROUTES.HOME);
    if (hasRedirectTo) {
      yield history.push(hasRedirectTo);
    }
    yield put(closeLoginModal());
    yield put(setRedirectPath(null));
  });
}

export function* profileSuccess() {
  yield takeEvery(PROFILE_SUCCESS, function*(action) {
    try {
      if (!action.data.secretSet && action.data.secretSetNotification)
        yield put(
          createNotification({
            action: ACTIONS.RECOVERY,
            type: BADGE_TYPES.ALERT,
            pagesToShow: [ROUTES.HOME],
          }),
        );
    } catch (e) {
      console.error(e);
    }

    for (const fioWallet of action.data.fioWallets) {
      yield put(refreshBalance(fioWallet.publicKey));
    }
  });
}

export function* signupSuccess() {
  yield takeEvery(SIGNUP_SUCCESS, function*() {});
}

export function* logoutSuccess(history, api) {
  yield takeEvery(LOGOUT_SUCCESS, function() {
    api.client.removeToken();
  });
}

export function* setRecoverySuccess() {
  yield takeEvery(SET_RECOVERY_SUCCESS, function*() {
    yield put(closeRecoveryModal());
  });
}

export function* nonceSuccess() {
  yield takeEvery(NONCE_SUCCESS, function*(action) {
    const { email, signature, nonce } = action.data;
    yield put(
      login({
        email,
        signature,
        challenge: nonce,
      }),
    );
  });
}

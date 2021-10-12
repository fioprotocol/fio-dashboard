import { put, takeEvery, select } from 'redux-saga/effects';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { setWallets } from '../account/actions';
import { refreshBalance } from '../fio/actions';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
  NONCE_SUCCESS,
  RESEND_CONFIRM_EMAIL_SUCCESS,
  loadProfile,
  login,
} from './actions';

import {
  showEmailConfirmBlocker,
  closeEmailConfirmBlocker,
  closeLoginModal,
} from '../modal/actions';
import {
  listNotifications,
  createNotification,
} from '../notifications/actions';
import { setRedirectPath } from '../navigation/actions';

import { redirectLink } from '../navigation/selectors';
import { fioWallets } from '../fio/selectors';
import { ROUTES } from '../../constants/routes';

export function* loginSuccess(history, api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    const hasRedirectTo = yield select(redirectLink);
    const wallets = yield select(fioWallets);
    api.client.setToken(action.data.jwt);
    if (wallets && wallets.length) yield put(setWallets(wallets));
    yield put(loadProfile());
    yield put(listNotifications());
    if (hasRedirectTo) {
      yield history.push(hasRedirectTo);
    }
    yield put(closeLoginModal());
    yield put(setRedirectPath(null));
  });
}

export function* loginFailure() {
  yield takeEvery(LOGIN_FAILURE, function*(action) {
    if (action.error != null && action.error.code === 'NOT_ACTIVE_USER') {
      yield put(closeLoginModal());
      yield put(showEmailConfirmBlocker(action.error.data.token));
    }
  });
}

export function* resendConfirmEmailSuccess() {
  yield takeEvery(RESEND_CONFIRM_EMAIL_SUCCESS, function*() {
    yield put(closeEmailConfirmBlocker());
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

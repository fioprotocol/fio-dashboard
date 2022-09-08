import { History } from 'history';
import { put, select, takeEvery } from 'redux-saga/effects';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ACTIONS } from '../../components/Notifications/Notifications';

import { log } from '../../util/general';

import { setWallets } from '../account/actions';
import { refreshBalance } from '../fio/actions';
import {
  loadAdminProfile,
  loadProfile,
  login,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT_SUCCESS,
  CONFIRM_ADMIN_EMAIL_SUCCESS,
  CONFIRM_EMAIL_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  NONCE_SUCCESS,
  PROFILE_SUCCESS,
  RESET_ADMIN_PASSWORD_SUCCESS,
} from './actions';

import { closeLoginModal } from '../modal/actions';
import {
  createNotification,
  listNotifications,
} from '../notifications/actions';
import { setRedirectPath } from '../navigation/actions';

import {
  locationState as locationStateSelector,
  redirectLink,
} from '../navigation/selectors';
import { fioWallets } from '../fio/selectors';
import { ROUTES } from '../../constants/routes';

import { Api } from '../../api';

import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';
import { USER_STATUSES } from '../../constants/common';

import { FioWalletDoublet, PrivateRedirectLocationState } from '../../types';
import { Action } from '../types';
import { AuthDeleteNewDeviceRequestResponse } from '../../api/responses';

export function* loginSuccess(history: History, api: Api): Generator {
  yield takeEvery(LOGIN_SUCCESS, function*(action: Action) {
    const hasRedirectTo: { pathname: string; state: object } = yield select(
      redirectLink,
    );
    const wallets: FioWalletDoublet[] = yield select(fioWallets);
    api.client.setToken(action.data.jwt);
    if (wallets && wallets.length) yield put<Action>(setWallets(wallets));
    if ((action.otpKey && action.voucherId) || action.voucherId)
      try {
        // We have to wait delete voucher call from server to get updated profile then.
        // Sagas doesn't wait. So in this case we have to write result into a constant.
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const res: AuthDeleteNewDeviceRequestResponse = yield api.auth.deleteNewDeviceRequest(
          action.voucherId,
        );
      } catch (e) {
        log.error(e);
      }
    yield put<Action>(loadProfile());
    yield put<Action>(listNotifications());

    const locationState: PrivateRedirectLocationState = yield select(
      locationStateSelector,
    );
    if (
      !hasRedirectTo &&
      locationState &&
      locationState.from &&
      locationState.from.pathname
    ) {
      history.push(locationState.from.pathname);
    }
    if (hasRedirectTo) {
      history.push(hasRedirectTo.pathname, hasRedirectTo.state);
    }

    yield put(closeLoginModal());
  });
}

export function* profileSuccess(): Generator {
  yield takeEvery(PROFILE_SUCCESS, function*(action: Action) {
    try {
      if (!action.data.secretSet && action.data.secretSetNotification)
        yield put<Action>(
          createNotification({
            action: ACTIONS.RECOVERY,
            contentType: NOTIFICATIONS_CONTENT_TYPE.RECOVERY_PASSWORD,
            type: BADGE_TYPES.ALERT,
            pagesToShow: [ROUTES.HOME],
          }),
        );
    } catch (e) {
      log.error(e);
    }

    for (const fioWallet of action.data.fioWallets) {
      yield put<Action>(refreshBalance(fioWallet.publicKey));
    }

    if (action.data.status === USER_STATUSES.ACTIVE) {
      yield put(setRedirectPath(null));
    }
  });
}

export function* logoutSuccess(history: History, api: Api): Generator {
  yield takeEvery(LOGOUT_SUCCESS, function(action: Action) {
    api.client.removeToken();

    const { redirect } = action;

    if (redirect) history.push(redirect, {});
    if (!redirect) history.replace(ROUTES.HOME, {});
  });
}

export function* nonceSuccess(): Generator {
  yield takeEvery(NONCE_SUCCESS, function*(action: Action) {
    const { email, signature, nonce, otpKey, voucherId } = action.data;

    yield put<Action>(
      login({
        email,
        signature,
        challenge: nonce,
        otpKey,
        voucherId,
      }),
    );
  });
}

export function* confirmEmailSuccess(history: History): Generator {
  yield takeEvery(CONFIRM_EMAIL_SUCCESS, function*() {
    yield history.replace(ROUTES.CONFIRM_EMAIL_RESULT);
  });
}

export function* adminLogoutSuccess(history: History, api: Api): Generator {
  yield takeEvery(ADMIN_LOGOUT_SUCCESS, function(action: Action) {
    api.client.removeAdminToken();

    const { redirect } = action;

    if (redirect) history.push(redirect, {});
    if (!redirect) history.replace(ROUTES.ADMIN_LOGIN, {});
  });
}

export function* adminLoginSuccess(history: History, api: Api): Generator {
  yield takeEvery(ADMIN_LOGIN_SUCCESS, function*(action: Action) {
    api.client.setAdminToken(action.data.jwt);

    yield put<Action>(loadAdminProfile());

    history.push(ROUTES.ADMIN_HOME);
  });
}

export function* adminConfirmSuccess(history: History, api: Api): Generator {
  yield takeEvery(CONFIRM_ADMIN_EMAIL_SUCCESS, function*(action: Action) {
    api.client.setAdminToken(action.data.jwt);

    yield put<Action>(loadAdminProfile());

    history.push(ROUTES.ADMIN_HOME);
  });
}

export function* adminResetPasswordSuccess(
  history: History,
  api: Api,
): Generator {
  yield takeEvery(RESET_ADMIN_PASSWORD_SUCCESS, function(action: Action) {
    history.replace(ROUTES.ADMIN_LOGIN, {});
  });
}

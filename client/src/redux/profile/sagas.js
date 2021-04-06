import { put, takeEvery } from 'redux-saga/effects';
import { BADGE_TYPES } from '../../components/NotificationBadge/NotificationBadge';
import { ACTIONS } from '../../components/Notifications/Notifications';
import {
  LOGIN_SUCCESS,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
  SET_RECOVERY_SUCCESS,
  loadProfile,
} from './actions';

import { closeRecoveryModal } from '../modal/actions';
import {
  listNotifications,
  createNotification,
} from '../notifications/actions';
import { ROUTES } from '../../constants/routes';

export function* loginSuccess(history, api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    api.client.setToken(action.data.jwt);
    yield put(loadProfile());
    yield put(listNotifications());
    yield history.push(ROUTES.DASHBOARD);
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
          }),
        );
    } catch (e) {
      console.error(e);
    }
  });
}

export function* signupSuccess() {
  yield takeEvery(SIGNUP_SUCCESS, function*() {});
}

export function* logoutSuccess(history, api) {
  yield takeEvery(LOGOUT_SUCCESS, function() {
    api.client.removeToken();
    history.push(ROUTES.HOME);
    window.location.reload();
  });
}

export function* setRecoverySuccess() {
  yield takeEvery(SET_RECOVERY_SUCCESS, function*() {
    yield put(closeRecoveryModal());
  });
}

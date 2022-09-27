import { put, takeEvery } from 'redux-saga/effects';

import {
  RESET_ADMIN_USER_PASSWORD_SUCCESS,
  DELETE_ADMIN_USER_SUCCESS,
} from './actions';
import { addManual as createNotification } from '../notifications/actions';

import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';
import { ROUTES } from '../../constants/routes';

import { Action } from '../types';

export function* resetAdminUserPasswordSuccess(): Generator {
  yield takeEvery(RESET_ADMIN_USER_PASSWORD_SUCCESS, function*() {
    yield put<Action>(
      createNotification({
        action: ACTIONS.RESET_ADMIN_USER_PASSWORD,
        type: BADGE_TYPES.SUCCESS,
        contentType: NOTIFICATIONS_CONTENT_TYPE.RESET_ADMIN_USER_PASSWORD,
        pagesToShow: [ROUTES.ADMIN_USERS],
      }),
    );
  });
}
export function* deleteAdminUserSuccess(): Generator {
  yield takeEvery(DELETE_ADMIN_USER_SUCCESS, function*() {
    yield put<Action>(
      createNotification({
        action: ACTIONS.DELETE_ADMIN_USER_SUCCESS,
        type: BADGE_TYPES.SUCCESS,
        contentType: NOTIFICATIONS_CONTENT_TYPE.DELETE_ADMIN_USER_SUCCESS,
        pagesToShow: [ROUTES.ADMIN_USERS],
      }),
    );
  });
}

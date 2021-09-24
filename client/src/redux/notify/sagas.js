import { put, takeEvery } from 'redux-saga/effects';
import { PROFILE_FAILURE, LOGIN_FAILURE, logout } from '../profile/actions';
import {
  LOGIN_FAILURE as LOGIN_EDGE_FAILURE,
  CONFIRM_PIN_FAILURE,
} from '../edge/actions';
import { LIST_FAILURE as NOTIFICATIONS_LIST_FAILURE } from '../notifications/actions';
import { showGenericErrorModal } from '../modal/actions';

import { ErrorText } from './constants';
import { ROUTES } from '../../constants/routes';

export const toString = obj =>
  Object.entries(obj)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

export function* notify(history) {
  yield takeEvery('*', function*(action) {
    if (
      action.error &&
      action.type !== PROFILE_FAILURE &&
      action.type !== LOGIN_FAILURE &&
      action.type !== LOGIN_EDGE_FAILURE &&
      action.type !== NOTIFICATIONS_LIST_FAILURE &&
      action.type !== CONFIRM_PIN_FAILURE
    ) {
      const { message, title, buttonText } = ErrorText[action.type];

      yield put(showGenericErrorModal(message, title, buttonText));
      yield history.push(ROUTES.HOME);
    }

    if (
      action.error &&
      action.error.code === 'PERMISSION_DENIED' &&
      action.error.fields &&
      action.error.fields.token === 'WRONG_TOKEN'
    ) {
      yield put(logout({ history }));
    }
  });
}

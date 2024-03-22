import { History } from 'history';
import { put, select, takeEvery } from 'redux-saga/effects';

import {
  ADMIN_PROFILE_FAILURE,
  adminLogout,
  AUTH_CHECK_FAILURE,
  LOGIN_FAILURE,
  logout,
  PROFILE_FAILURE,
  ALTERNATE_LOGIN_FAILURE,
} from '../profile/actions';
import {
  CONFIRM_PIN_FAILURE,
  LOGIN_FAILURE as LOGIN_EDGE_FAILURE,
  RECOVERY_ACCOUNT_FAILURE,
} from '../edge/actions';
import { LIST_FAILURE as NOTIFICATIONS_LIST_FAILURE } from '../notifications/actions';
import {
  GET_ALL_PUBLIC_ADDRESS_FAILURE,
  GET_ORACLE_FEES_FAILURE,
} from '../fio/actions';
import { showGenericErrorModal } from '../modal/actions';
import { showGenericError as getShowGenericError } from '../modal/selectors';

import { ErrorData } from './constants';
import { ADMIN_ROUTES, ROUTES } from '../../constants/routes';

import { Action } from '../types';

export const toString = (obj: object): string =>
  Object.entries(obj)
    .map(([key, val]) => `${key}: ${val as string}`)
    .join(', ');

export function* notify(history: History): Generator {
  yield takeEvery('*', function*(action: Action) {
    if (
      action.error &&
      action.type !== PROFILE_FAILURE &&
      action.type !== AUTH_CHECK_FAILURE &&
      action.type !== ADMIN_PROFILE_FAILURE &&
      action.type !== LOGIN_FAILURE &&
      action.type !== LOGIN_EDGE_FAILURE &&
      action.type !== NOTIFICATIONS_LIST_FAILURE &&
      action.type !== CONFIRM_PIN_FAILURE &&
      action.type !== GET_ALL_PUBLIC_ADDRESS_FAILURE &&
      action.type !== GET_ORACLE_FEES_FAILURE &&
      action.type !== RECOVERY_ACCOUNT_FAILURE &&
      action.type !== ALTERNATE_LOGIN_FAILURE
    ) {
      const genericErrorIsShowing: boolean = yield select(getShowGenericError);

      if (!genericErrorIsShowing) {
        const { buttonText, message, redirect, title } =
          ErrorData[action.type] || {};

        yield put(showGenericErrorModal(message, title, buttonText));
        if (redirect) history.push(redirect);
      }
    }

    if (
      action.error &&
      action.error.code === 'PERMISSION_DENIED' &&
      action.error.fields &&
      action.error.fields.token === 'WRONG_TOKEN'
    ) {
      if (action.type === ADMIN_PROFILE_FAILURE) {
        yield put<Action>(adminLogout({ history }, ADMIN_ROUTES.ADMIN_LOGIN));
      } else yield put<Action>(logout({ history, redirect: ROUTES.HOME }));
    }
  });
}

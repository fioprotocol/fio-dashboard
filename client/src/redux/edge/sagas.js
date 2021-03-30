import { put, takeEvery } from 'redux-saga/effects';
import {
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
} from './actions';

import { closeLoginModal } from '../modal/actions';

import { ROUTES } from '../../constants/routes';

export function* loginSuccess(history, api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    yield put(closeLoginModal());
    // api.client.setToken(action.data.jwt);
    // yield put(loadProfile());
    // yield history.push(ROUTES.DASHBOARD);
  });
}

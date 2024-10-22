import { History } from 'history';
import { all } from 'redux-saga/effects';

import {
  adminConfirmSuccess,
  adminLoginSuccess,
  adminLogoutSuccess,
  adminResetPasswordSuccess,
} from '../../redux/profile/sagas';
import { notify } from '../../redux/notify/sagas';
import {
  resetAdminUserPasswordSuccess,
  deleteAdminUserSuccess,
} from '../../redux/admin/sagas';

import { Api } from '../api';

export default function* rootSaga(history: History, api: Api) {
  yield all([
    notify(history),
    adminLogoutSuccess(history),
    adminLoginSuccess(history, api),
    adminConfirmSuccess(history, api),
    adminResetPasswordSuccess(history),
    resetAdminUserPasswordSuccess(),
    deleteAdminUserSuccess(),
  ]);
}

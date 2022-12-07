import { History } from 'history';
import { all } from 'redux-saga/effects';

import {
  adminConfirmSuccess,
  adminLoginSuccess,
  adminLogoutSuccess,
  adminResetPasswordSuccess,
  loginSuccess,
  logoutSuccess,
  nonceSuccess,
  profileSuccess,
  activateAffiliateSuccess,
} from './profile/sagas';
import { edgeLoginSuccess } from './edge/sagas';
import { notify } from './notify/sagas';
import { cartWasCleared } from './cart/sagas';
import {
  containedFlowActionSuccess,
  containedFlowResultsClose,
  handleContainedFlowSteps,
  purchaseResultsClose,
  setContainedFlowToInitStep,
} from './containedFlow/sagas';
import { clearGenericModalError } from './modal/sagas';
import {
  addFioWalletSuccess,
  setBalancesService,
  setFeesService,
} from './fio/sagas';
import { getRefProfileSuccess } from './refProfile/sagas';
import {
  resetAdminUserPasswordSuccess,
  deleteAdminUserSuccess,
  exportOrdersDataSuccess,
} from './admin/sagas';

import { Api } from '../api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function* rootSaga(history: History, api: Api) {
  yield all([
    loginSuccess(history, api),
    logoutSuccess(history, api),
    profileSuccess(),
    nonceSuccess(),
    activateAffiliateSuccess(history),
    edgeLoginSuccess(),
    notify(history),
    clearGenericModalError(),
    containedFlowActionSuccess(),
    containedFlowResultsClose(),
    setContainedFlowToInitStep(),
    handleContainedFlowSteps(history),
    setFeesService(),
    addFioWalletSuccess(),
    setBalancesService(),
    purchaseResultsClose(history),
    adminLogoutSuccess(history, api),
    adminLoginSuccess(history, api),
    adminConfirmSuccess(history, api),
    adminResetPasswordSuccess(history, api),
    getRefProfileSuccess(),
    resetAdminUserPasswordSuccess(),
    deleteAdminUserSuccess(),
    exportOrdersDataSuccess(),
    cartWasCleared(),
  ]);
}

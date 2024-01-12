import { History } from 'history';
import { all } from 'redux-saga/effects';

import {
  loginSuccess,
  logoutSuccess,
  nonceSuccess,
  profileSuccess,
  activateAffiliateSuccess,
  alternateLoginSuccess,
} from './profile/sagas';
import { edgeLoginSuccess, edgePinUpdateSuccess } from './edge/sagas';
import { notify } from './notify/sagas';
import {
  addItem,
  cartWasCleared,
  deleteItem,
  updatePeriodItem,
} from './cart/sagas';
import {
  containedFlowActionSuccess,
  containedFlowResultsClose,
  handleContainedFlowSteps,
  purchaseResultsClose,
  setContainedFlowToInitStep,
} from './containedFlow/sagas';
import {
  clearGenericModalError,
  clearGenericModalSuccess,
} from './modal/sagas';
import {
  addFioWalletSuccess,
  setBalancesService,
  setFeesService,
} from './fio/sagas';
import { getRefProfileSuccess } from './refProfile/sagas';

import { Api } from '../api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function* rootSaga(history: History, api: Api) {
  yield all([
    alternateLoginSuccess(history, api),
    loginSuccess(history, api),
    logoutSuccess(history, api),
    profileSuccess(),
    nonceSuccess(),
    activateAffiliateSuccess(history),
    edgeLoginSuccess(),
    edgePinUpdateSuccess(),
    notify(history),
    clearGenericModalError(),
    clearGenericModalSuccess(),
    containedFlowActionSuccess(),
    containedFlowResultsClose(),
    setContainedFlowToInitStep(),
    handleContainedFlowSteps(history),
    setFeesService(),
    addFioWalletSuccess(),
    setBalancesService(),
    purchaseResultsClose(history),
    getRefProfileSuccess(),
    cartWasCleared(),
    addItem(),
    deleteItem(),
    updatePeriodItem(),
  ]);
}

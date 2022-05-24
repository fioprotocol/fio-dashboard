import { put, takeEvery, select } from 'redux-saga/effects';

import {
  CONTAINED_FLOW_STEPS,
  CONTAINED_FLOW_ACTIONS,
} from '../../constants/containedFlow';
import { setStep } from './actions';
import { LOGIN_SUCCESS } from '../profile/actions';

import { SET_REGISTRATION_RESULTS } from '../registrations/actions';
import { FIO_EXECUTE_ACTION_SUCCESS } from '../fio/actions';
import {
  isContainedFlow as getIsContainedFlow,
  containedFlowQueryParams,
} from './selectors';

import { Action } from '../types';
import { ContainedFlowQueryParams } from '../../types';

export function* containedFlowLoginSuccess(): Generator {
  yield takeEvery(LOGIN_SUCCESS, function*() {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);
    if (isContainedFlow) {
      yield put(setStep(CONTAINED_FLOW_STEPS.REGISTRATION));
    }
  });
}

export function* fioAddressRegisterSuccess(): Generator {
  yield takeEvery(SET_REGISTRATION_RESULTS, function*(action: Action) {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);
    if (isContainedFlow && action.data.success) {
      yield put(setStep(CONTAINED_FLOW_STEPS.ACTION));
    }
  });
}

export function* containedFlowActionSuccess(): Generator {
  yield takeEvery(FIO_EXECUTE_ACTION_SUCCESS, function*(action: Action) {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);

    if (
      isContainedFlow &&
      action.data.status &&
      action.data.executeActionType === CONTAINED_FLOW_ACTIONS.SIGNNFT
    ) {
      const { r }: ContainedFlowQueryParams = yield select(
        containedFlowQueryParams,
      );
      const redirectUrl = `${r}?txId=${action.data.transaction_id as string}`;

      yield put(setStep(CONTAINED_FLOW_STEPS.FINISH));
      window.location.replace(redirectUrl);
    }
  });
}

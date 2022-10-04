import { put, takeEvery, select } from 'redux-saga/effects';
import { History } from 'history';

import {
  CONTAINED_FLOW_STEPS,
  CONTAINED_FLOW_ACTIONS_TO_ROUTES,
  CONTAINED_FLOW_ACTIONS,
} from '../../constants/containedFlow';
import { setStep, SET_STEP, resetContainedParams } from './actions';

import { clear as clearCart } from '../cart/actions';

import {
  FIO_ACTION_EXECUTE_SUCCESS,
  TRANSACTION_RESULTS_CLOSE,
} from '../fio/actions';

import { setRedirectPath } from '../navigation/actions';

import { PURCHASE_RESULTS_CLOSE } from '../registrations/actions';

import { LOGOUT_SUCCESS } from '../profile/actions';

import {
  isContainedFlow as getIsContainedFlow,
  containedFlowQueryParams as getContainedFlowQueryParams,
  containedFlowStep as getContainedFlowStep,
} from './selectors';

import { cartItems } from '../cart/selectors';

import { redirectLink } from '../navigation/selectors';

import { ROUTES } from '../../constants/routes';

import { Action } from '../types';
import { CartItem, ContainedFlowQueryParams } from '../../types';

export function* setContainedFlowToInitStep(): Generator {
  yield takeEvery(LOGOUT_SUCCESS, function*() {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);

    if (isContainedFlow) {
      yield put(setStep(CONTAINED_FLOW_STEPS.INIT));
    }
  });
}

export function* containedFlowActionSuccess(): Generator {
  yield takeEvery(FIO_ACTION_EXECUTE_SUCCESS, function*(action: Action) {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);
    const containedFlowStep: keyof typeof CONTAINED_FLOW_STEPS = yield select(
      getContainedFlowStep,
    );

    if (
      isContainedFlow &&
      action.data.result.status &&
      containedFlowStep === CONTAINED_FLOW_STEPS.ACTION
    ) {
      const { r }: ContainedFlowQueryParams = yield select(
        getContainedFlowQueryParams,
      );

      yield put(clearCart());

      if (r) {
        let redirectUrl = r;
        if (action.data.result.txIds)
          redirectUrl += `?txIds=${action.data.result.txIds as string}`;

        yield put(setStep(CONTAINED_FLOW_STEPS.FINISH, { redirectUrl }));
      }
    }
  });
}

export function* purchaseResultsClose(history: History): Generator {
  yield takeEvery(PURCHASE_RESULTS_CLOSE, function*() {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);
    const containedFlowQueryParams: ContainedFlowQueryParams = yield select(
      getContainedFlowQueryParams,
    );

    if (isContainedFlow) {
      if (containedFlowQueryParams.action === CONTAINED_FLOW_ACTIONS.REG) {
        yield put(setStep(CONTAINED_FLOW_STEPS.FINISH));
      } else {
        yield put(
          setStep(CONTAINED_FLOW_STEPS.ACTION, {
            containedFlowAction: containedFlowQueryParams.action,
          }),
        );
        return;
      }
    }

    yield history.push(ROUTES.HOME);
  });
}

export function* containedFlowResultsClose(): Generator {
  yield takeEvery(TRANSACTION_RESULTS_CLOSE, function*() {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);
    if (isContainedFlow) {
      yield put(setStep(CONTAINED_FLOW_STEPS.FINISH));
    }
  });
}

export function* handleContainedFlowSteps(history: History): Generator {
  yield takeEvery(SET_STEP, function*(action: Action) {
    const isContainedFlow: boolean = yield select(getIsContainedFlow);

    const containedFlowQueryParams: ContainedFlowQueryParams = yield select(
      getContainedFlowQueryParams,
    );

    const cart: CartItem[] = yield select(cartItems);
    if (isContainedFlow) {
      switch (action.step) {
        case CONTAINED_FLOW_STEPS.REGISTRATION: {
          const registrationPath = cart.length
            ? ROUTES.CHECKOUT
            : ROUTES.FIO_ADDRESSES_SELECTION;
          const redirectLinkSelector: string = yield select(redirectLink);

          if (!redirectLinkSelector) {
            yield put<Action>(setRedirectPath({ pathname: registrationPath }));
          }
          yield history.push(registrationPath, {
            containedFlowQueryParams,
          }); // todo: check containedFlowQueryParams when registrationPath is CHECKOUT, we need to set orderParams in this case
          break;
        }
        case CONTAINED_FLOW_STEPS.ACTION: {
          yield history.push(
            CONTAINED_FLOW_ACTIONS_TO_ROUTES[action.data.containedFlowAction],
            {
              initialValues: containedFlowQueryParams,
            },
          );
          break;
        }
        case CONTAINED_FLOW_STEPS.FINISH: {
          yield put(resetContainedParams());

          if (action.data?.redirectUrl)
            window.location.replace(action.data.redirectUrl);

          break;
        }
        default:
          return null;
      }
    }
  });
}

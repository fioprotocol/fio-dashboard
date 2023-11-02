import { put, select, takeEvery } from 'redux-saga/effects';

import { addManual as createNotification } from '../notifications/actions';
import {
  containedFlowQueryParams as getContainedFlowQueryParams,
  isContainedFlow as getIsContainedFlow,
} from '../containedFlow/selectors';

import { CLEAR_CART_SUCCESS } from './actions';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';
import { CONTAINED_FLOW_NOTIFICATION_MESSAGES } from '../../constants/containedFlow';
import { ROUTES } from '../../constants/routes';
import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';

import { fireAnalyticsEventDebounced } from '../../util/analytics';

import { Action } from '../types';
import { ContainedFlowQueryParams } from '../../types';

export function* cartWasCleared(): Generator {
  yield takeEvery(CLEAR_CART_SUCCESS, function*(action: Action) {
    const { isNotify } = action;
    const isContainedFlow: boolean = yield select(getIsContainedFlow);
    const containedFlowQueryParams: ContainedFlowQueryParams = yield select(
      getContainedFlowQueryParams,
    );

    const containedFlowAction = containedFlowQueryParams
      ? containedFlowQueryParams.action.toUpperCase()
      : '';

    if (isNotify) {
      yield put<Action>(
        createNotification({
          action: ACTIONS.CART_TIMEOUT,
          type: BADGE_TYPES.WARNING,
          contentType: NOTIFICATIONS_CONTENT_TYPE.CART_TIMEOUT,
          title: NOTIFICATIONS_CONTENT.CART_TIMEOUT.title,
          message:
            isContainedFlow && containedFlowAction != null
              ? `${NOTIFICATIONS_CONTENT.CART_TIMEOUT.message}, ${CONTAINED_FLOW_NOTIFICATION_MESSAGES[containedFlowAction]}.`
              : `${NOTIFICATIONS_CONTENT.CART_TIMEOUT.message}. Add your items again.`,
          pagesToShow: [
            ROUTES.CART,
            ROUTES.FIO_ADDRESSES_SELECTION,
            ROUTES.FIO_DOMAINS_SELECTION,
            ROUTES.HOME,
            ROUTES.DASHBOARD,
          ],
        }),
      );
    }

    fireAnalyticsEventDebounced(ANALYTICS_EVENT_ACTIONS.CART_EMPTIED);
  });
}

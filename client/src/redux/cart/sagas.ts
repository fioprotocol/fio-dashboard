import { put, select, takeEvery } from 'redux-saga/effects';

import { addManual as createNotification } from '../notifications/actions';
import {
  containedFlowQueryParams as getContainedFlowQueryParams,
  isContainedFlow as getIsContainedFlow,
} from '../containedFlow/selectors';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../registrations/selectors';

import {
  ADD_ITEM_SUCCESS,
  CLEAR_CART_SUCCESS,
  DELETE_ITEM_SUCCESS,
  UPDATE_CART_ITEM_PERIOD_SUCCESS,
} from './actions';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';
import { CONTAINED_FLOW_NOTIFICATION_MESSAGES } from '../../constants/containedFlow';
import { ROUTES } from '../../constants/routes';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';

import {
  fireAnalyticsEvent,
  fireAnalyticsEventDebounced,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import { convertFioPrices } from '../../util/prices';

import { Action } from '../types';
import { ContainedFlowQueryParams, Prices } from '../../types';

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

export function* addItem(): Generator {
  yield takeEvery(ADD_ITEM_SUCCESS, function*(action: Action) {
    const { cartItem } = action;

    yield fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
      getCartItemsDataForAnalytics([cartItem]),
    );
  });
}

export function* deleteItem(): Generator {
  yield takeEvery(DELETE_ITEM_SUCCESS, function*(action: Action) {
    const { cartItem } = action;

    yield fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.REMOVE_ITEM_FROM_CART,
      getCartItemsDataForAnalytics([cartItem]),
    );
  });
}

export function* updatePeriodItem(): Generator {
  yield takeEvery(UPDATE_CART_ITEM_PERIOD_SUCCESS, function*(action: Action) {
    const { cartItem, newPeriod } = action;
    const { period } = cartItem;

    if (newPeriod !== period) {
      const periodDiff = Math.abs(period - newPeriod);

      const prices: Prices = yield select(pricesSelector);
      const roe: number = yield select(roeSelector);

      fireAnalyticsEvent(
        newPeriod > period
          ? ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART
          : ANALYTICS_EVENT_ACTIONS.REMOVE_ITEM_FROM_CART,
        getCartItemsDataForAnalytics([
          {
            ...cartItem,
            type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
            period: periodDiff,
            costUsdc: convertFioPrices(prices.nativeFio.renewDomain, roe).usdc,
          },
        ]),
      );
    }
  });
}

import debounce from 'lodash/debounce';

import {
  ANALYTICS_EVENT_ACTIONS,
  ANALYTICS_FIO_NAME_TYPE,
  ANALYTICS_SEND_TYPE,
  ANALYTICS_WALLET_TYPE,
  CONFIRM_FIO_ACTIONS,
  CURRENCY_CODES,
  DOMAIN,
} from '../constants/common';

import MathOp from './math';

import {
  AnyObject,
  CartItem,
  AnalyticsEventActions,
  FioActions,
} from '../types';

const DEBOUNCE_TIMEOUT = 1000;

export const fireAnalyticsEvent = (
  event: string,
  data: AnyObject = {},
): void => {
  window.dataLayer?.push({
    event,
    ...data,
  });
};

export const fireAnalyticsEventDebounced = debounce(
  fireAnalyticsEvent,
  DEBOUNCE_TIMEOUT,
);

export const firePageViewAnalyticsEvent = (
  title: string,
  location: string,
  shouldFireOnce = false,
): void => {
  if (shouldFireOnce) {
    const exists = window.dataLayer?.find(
      item =>
        item.event === ANALYTICS_EVENT_ACTIONS.VIRTUAL_PAGE_VIEW &&
        item.vpv_page_location === location,
    );
    if (exists) {
      return;
    }
  }
  fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.VIRTUAL_PAGE_VIEW, {
    vpv_page_title: title,
    vpv_page_location: location,
  });
};

export const getCartItemsDataForAnalytics = (
  cartItems: CartItem[],
): AnyObject => {
  return {
    currency: CURRENCY_CODES.USD,
    value: +cartItems.reduce(
      (sum, item) => new MathOp(sum).add(item.costUsdc || 0).toNumber(),
      0,
    ),
    items: cartItems
      .map(cartItem => {
        const item = {
          item_name: !cartItem.costUsdc
            ? ANALYTICS_FIO_NAME_TYPE.ADDRESS_FREE
            : cartItem.type,
          price: +cartItem.costUsdc,
          _clear: true,
        };

        if (cartItem.period > 1) {
          item.price = +(item.price / cartItem.period).toFixed(2);
          const items = [item];
          for (let i = 1; i < cartItem.period; i++) {
            items.push({
              item_name: ANALYTICS_FIO_NAME_TYPE.DOMAIN_RENEWAL,
              price: item.price,
              _clear: true,
            });
          }

          return items;
        }
        return item;
      })
      .flat(),
  };
};
export const prepareAnalyticsEventData = (
  event: string,
  data: AnyObject,
): AnyObject => {
  const result: AnyObject = {};

  switch (event) {
    case ANALYTICS_EVENT_ACTIONS.SEND:
      result.token_send_amount = +data.amount;
      result.token_send_type = data.to
        ? ANALYTICS_SEND_TYPE.ADDRESS
        : ANALYTICS_SEND_TYPE.PUBLIC_KEY;
      break;
    case ANALYTICS_EVENT_ACTIONS.STAKE:
      result.token_stake_amount = +data.amount;
      break;
    case ANALYTICS_EVENT_ACTIONS.UNSTAKE:
      result.token_unstake_amount = +data.amount;
      break;
    case ANALYTICS_EVENT_ACTIONS.CREATE_WALLET:
      result.wallet_create_type = data.ledger
        ? ANALYTICS_WALLET_TYPE.LEDGER
        : ANALYTICS_WALLET_TYPE.EDGE;
      break;
  }

  return result;
};

export const fireActionAnalyticsEventError = (action: string): void => {
  if (CONFIRM_FIO_ACTIONS[action as keyof FioActions]) {
    fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.CHAIN_ERROR);
  }
};

export const fireActionAnalyticsEvent = (
  action: string,
  additionalData: AnyObject = {},
): void => {
  if (ANALYTICS_EVENT_ACTIONS[action as keyof AnalyticsEventActions]) {
    let event = ANALYTICS_EVENT_ACTIONS[action as keyof AnalyticsEventActions];
    if (action === CONFIRM_FIO_ACTIONS.TRANSFER) {
      event =
        additionalData?.fioNameType === DOMAIN
          ? ANALYTICS_EVENT_ACTIONS.TRANSFER_DOMAIN
          : ANALYTICS_EVENT_ACTIONS.TRANSFER_FCH;
    }
    fireAnalyticsEvent(event, prepareAnalyticsEventData(event, additionalData));
  }
};

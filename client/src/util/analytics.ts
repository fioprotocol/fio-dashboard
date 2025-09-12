import debounce from 'lodash/debounce';
import Cookies from 'js-cookie';

import {
  ANALYTICS_EVENT_ACTIONS,
  ANALYTICS_FIO_NAME_TYPE,
  ANALYTICS_SEND_TYPE,
  ANALYTICS_WALLET_TYPE,
  CART_ITEM_TYPE,
  CONFIRM_FIO_ACTIONS,
  CURRENCY_CODES,
  DOMAIN,
} from '../constants/common';
import { DOMAIN_TYPE } from '../constants/fio';

import MathOp from './math';
import api from '../api';
import { log } from './general';
import { store } from '../redux/init';
import { convertFioPrices } from './prices';

import {
  AnyObject,
  CartItem,
  AnalyticsEventActions,
  FioActions,
} from '../types';

const DEBOUNCE_TIMEOUT = 1000;

export const getGAClientId = (): string | null => {
  const gaClientId = Cookies.get('_ga');
  if (gaClientId) return gaClientId.split('GA1.1.')[1];
  return null;
};
export const getGASessionId = (): string | null => {
  const gaId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID?.split('-')[1];
  const gaSessionId = Cookies.get(`_ga_${gaId}`);
  const gaSessionParam = gaSessionId
    ? gaSessionId.split('GS1.1.')[1] || gaSessionId.split('GS2.1.')[1]
    : null;

  if (gaSessionParam) return gaSessionParam.split('.')[0];
  return null;
};

export const fireAnalyticsEvent = (
  event: string,
  data: AnyObject = {},
): void => {
  if (
    ![
      ANALYTICS_EVENT_ACTIONS.PAGE_VIEW,
      ANALYTICS_EVENT_ACTIONS.VIRTUAL_PAGE_VIEW,
      ANALYTICS_EVENT_ACTIONS.CHAIN_ERROR,
    ].includes(event)
  ) {
    try {
      api.auth.sendEvent(event);
    } catch (err) {
      log.error(err);
    }
  }

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
  const currentStore = store.getState();
  const { prices, roe } = currentStore.registrations;
  const {
    nativeFio: {
      address: nativeFioAddressPrice,
      domain: nativeFioDomainPrice,
      renewDomain: nativeRenewDomainPrice,
    },
  } = prices;
  const renewDomainUsdcPrice = convertFioPrices(nativeRenewDomainPrice, roe)
    .usdc;
  const fioAddressUsdcPrice = convertFioPrices(nativeFioAddressPrice, roe).usdc;
  const fioDomainUsdcPrice = convertFioPrices(nativeFioDomainPrice, roe).usdc;

  return {
    currency: CURRENCY_CODES.USD,
    value: cartItems.reduce((sum, item) => {
      const { costUsdc, domainType, isFree, period, type } = item;

      let itemPrice =
        domainType === DOMAIN_TYPE.ALLOW_FREE && isFree ? 0 : costUsdc;

      if (type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) {
        itemPrice = new MathOp(fioAddressUsdcPrice)
          .add(fioDomainUsdcPrice)
          .toString();
      } else if (type === CART_ITEM_TYPE.DOMAIN) {
        itemPrice = fioDomainUsdcPrice;
      } else {
        itemPrice = renewDomainUsdcPrice;
      }

      for (let i = 1; i < period; i++) {
        itemPrice = new MathOp(renewDomainUsdcPrice).add(itemPrice).toString();
      }

      return new MathOp(sum).add(itemPrice).toString();
    }, '0'),
    items: cartItems
      .map(cartItem => {
        const item = {
          item_name:
            cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE && cartItem.isFree
              ? ANALYTICS_FIO_NAME_TYPE.ADDRESS_FREE
              : cartItem.type,
          price:
            cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE && cartItem.isFree
              ? 0
              : cartItem.costUsdc,
        };

        if (cartItem.period > 1) {
          if (cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) {
            item.price = new MathOp(fioAddressUsdcPrice)
              .add(fioDomainUsdcPrice)
              .toString();
          } else if (cartItem.type === CART_ITEM_TYPE.DOMAIN) {
            item.price = fioDomainUsdcPrice;
          } else {
            item.price = renewDomainUsdcPrice;
          }
          const items = [item];

          for (let i = 1; i < cartItem.period; i++) {
            items.push({
              item_name: ANALYTICS_FIO_NAME_TYPE.DOMAIN_RENEWAL,
              price: renewDomainUsdcPrice,
            });
          }

          return items;
        }
        return item;
      })
      .flat(),
    _clear: true,
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

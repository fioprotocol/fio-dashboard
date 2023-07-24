import { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getFee } from '../../redux/fio/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import { fees as feesSelector } from '../../redux/fio/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';

import apis from '../../api';

import { DEFAULT_FEE_PRICES } from '../../util/prices';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import {
  CART_ITEM_TYPE,
  ANALYTICS_EVENT_ACTIONS,
} from '../../constants/common';
import { ACTIONS } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';

const EMPTY_STATE_CONTENT = {
  title: 'No FIO Domains',
  message: 'There are no FIO Domains in all your wallets',
};

const WARNING_CONTENT = {
  DOMAIN_RENEW: {
    title: 'Domain Renewal',
    message:
      'One or more FIO Domain below has expired or is about to expire. Renew today to ensure you do not lose the domain.',
  },
};

type UseContextProps = {
  emptyStateContent: {
    title: string;
    message: string;
  };
  warningContent: {
    title: string;
    message: string;
  };
  handleRenewDomain: (name: string) => void;
};

export const useContext = (): UseContextProps => {
  const cartItems = useSelector(cartItemsSelector);
  const fees = useSelector(feesSelector);

  const dispatch = useDispatch();
  const history = useHistory();

  const renewDomainFeePrice =
    fees[apis.fio.actionEndPoints.renewFioDomain] || DEFAULT_FEE_PRICES;

  const handleRenewDomain = useCallback(
    (domain: string) => {
      const newCartItem = {
        domain,
        type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
        id: `${domain}-${ACTIONS.renewFioDomain}-${+new Date()}`,
        allowFree: false,
        period: 1,
        costNativeFio: renewDomainFeePrice?.nativeFio,
        costFio: renewDomainFeePrice.fio,
        costUsdc: renewDomainFeePrice.usdc,
      };

      addItemToCart(newCartItem);
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
        getCartItemsDataForAnalytics([newCartItem]),
      );
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
        getCartItemsDataForAnalytics([...cartItems, newCartItem]),
      );
      history.push(ROUTES.CART);
    },
    [
      cartItems,
      history,
      renewDomainFeePrice.fio,
      renewDomainFeePrice?.nativeFio,
      renewDomainFeePrice.usdc,
    ],
  );

  useEffect(() => {
    dispatch(getFee(apis.fio.actionEndPoints.renewFioDomain));
  }, [dispatch]);

  return {
    emptyStateContent: EMPTY_STATE_CONTENT,
    warningContent: WARNING_CONTENT.DOMAIN_RENEW,
    handleRenewDomain,
  };
};

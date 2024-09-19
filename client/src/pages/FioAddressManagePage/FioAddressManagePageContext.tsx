import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { EndPoint, GenericAction } from '@fioprotocol/fiosdk';

import {
  getFee,
  toggleFchBundleWarningBadge,
  toggleExpiredDomainFchBadge,
} from '../../redux/fio/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import {
  fees as feesSelector,
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  showFchBundleWarningBagde as showFchBundleWarningBagdeSelector,
  showExpiredDomainWarningFchBadge as showExpiredDomainWarningFchBadgeSelector,
} from '../../redux/fio/selectors';
import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
} from '../../redux/cart/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import apis from '../../api';

import { DEFAULT_FEE_PRICES } from '../../util/prices';
import { FIO_ADDRESS_DELIMITER } from '../../utils';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { log } from '../../util/general';
import { isDomainExpired } from '../../util/fio';

import {
  CART_ITEM_TYPE,
  ANALYTICS_EVENT_ACTIONS,
} from '../../constants/common';
import { LOW_BUNDLES_THRESHOLD } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';
import { EMPTY_STATE_CONTENT, WARNING_CONTENT } from './constants';

import { WarningContentItem } from '../../components/ManagePageContainer/types';
import useEffectOnce from '../../hooks/general';

type WarningContent = {
  [key: string]: WarningContentItem;
};

type UseContextProps = {
  emptyStateContent: {
    title: string;
    message: string;
  };
  warningContent: WarningContentItem[];
  handleAddBundles: (name: string) => void;
  onBuyFioHandleAction: () => void;
};

export const useContext = (): UseContextProps => {
  const cartItems = useSelector(cartItemsSelector);
  const cartId = useSelector(cartIdSelector);
  const fees = useSelector(feesSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const fioAddressesLoading = useSelector(fioAddressesLoadingSelector);
  const showFchBundleWarningBagde = useSelector(
    showFchBundleWarningBagdeSelector,
  );
  const showExpiredDomainWarningFchBadge = useSelector(
    showExpiredDomainWarningFchBadgeSelector,
  );
  const prices = useSelector(pricesSelector);
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);
  const userId = useSelector(userIdSelector);

  const [warningContent, setWarningContent] = useState<WarningContent>({
    LOW_BUNDLES: {
      ...WARNING_CONTENT.LOW_BUNDLES,
      show: false,
    },
    EXPIRED_DOMAINS: {
      ...WARNING_CONTENT.EXPIRED_DOMAINS,
      show: false,
    },
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const hasLowBundles =
    !!fioAddresses &&
    fioAddresses.some(
      fioAddress => fioAddress.remaining < LOW_BUNDLES_THRESHOLD,
    );

  const addBundlesFeePrice =
    fees[EndPoint.addBundledTransactions] || DEFAULT_FEE_PRICES;

  const handleAddBundles = useCallback(
    (name: string) => {
      const [address, domain] = name.split(FIO_ADDRESS_DELIMITER);
      const newCartItem = {
        address,
        domain,
        type: CART_ITEM_TYPE.ADD_BUNDLES,
        id: `${name}-${GenericAction.addBundledTransactions}-${+new Date()}`,
        costNativeFio: addBundlesFeePrice?.nativeFio,
        costFio: addBundlesFeePrice.fio,
        costUsdc: addBundlesFeePrice.usdc,
      };

      dispatch(
        addItemToCart({
          id: cartId,
          item: newCartItem,
          prices: prices?.nativeFio,
          refCode,
          roe,
          userId,
        }),
      );
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
      addBundlesFeePrice.fio,
      addBundlesFeePrice?.nativeFio,
      addBundlesFeePrice.usdc,
      cartId,
      cartItems,
      dispatch,
      history,
      prices?.nativeFio,
      refCode,
      roe,
      userId,
    ],
  );

  const onFchBundleWarningBadgeClose = useCallback(() => {
    setWarningContent({
      ...warningContent,
      LOW_BUNDLES: {
        ...warningContent.LOW_BUNDLES,
        show: false,
      },
    });
    dispatch(toggleFchBundleWarningBadge(false));
  }, [dispatch, warningContent]);

  const onExpiredDomainWarningBadgeClose = useCallback(() => {
    setWarningContent({
      ...warningContent,
      EXPIRED_DOMAINS: {
        ...warningContent.EXPIRED_DOMAINS,
        show: false,
      },
    });
    dispatch(toggleExpiredDomainFchBadge(false));
  }, [dispatch, warningContent]);

  const getDomainExpiration = useCallback(async (domainName: string) => {
    try {
      const { expiration } = (await apis.fio.getFioDomain(domainName)) || {};

      return expiration || null;
    } catch (err) {
      log.error(err);
    }
  }, []);

  const checkIsDomainExpired = useCallback(
    async (domainName: string) => {
      if (!domainName) return null;

      const expiration = await getDomainExpiration(domainName);

      return expiration && isDomainExpired(domainName, expiration);
    },
    [getDomainExpiration],
  );

  const hasExpiredDomain = useCallback(async () => {
    let hasExpiredDomain = false;

    const domains = fioAddresses.map(fioAddress =>
      fioAddress.name ? fioAddress.name.split(FIO_ADDRESS_DELIMITER)[1] : null,
    );

    const uniqueDomains = [...new Set(domains)];

    for (const domain of uniqueDomains) {
      const isExpired = await checkIsDomainExpired(domain);
      if (isExpired) {
        hasExpiredDomain = isExpired;
        break;
      }
    }

    return hasExpiredDomain;
  }, [checkIsDomainExpired, fioAddresses]);

  const handleExpiredWarningContent = useCallback(async () => {
    const fioHandlesHasExpiredDomain = await hasExpiredDomain();

    setWarningContent(prevWarningContent => ({
      ...prevWarningContent,
      EXPIRED_DOMAINS: {
        ...prevWarningContent.EXPIRED_DOMAINS,
        show: showExpiredDomainWarningFchBadge && fioHandlesHasExpiredDomain,
      },
    }));
  }, [hasExpiredDomain, showExpiredDomainWarningFchBadge]);

  useEffect(() => {
    dispatch(getFee(EndPoint.addBundledTransactions));
  }, [dispatch]);

  useEffectOnce(
    () => {
      if (!fioAddressesLoading) {
        setWarningContent(prevWarningContent => ({
          ...prevWarningContent,
          LOW_BUNDLES: {
            ...prevWarningContent.LOW_BUNDLES,
            show: showFchBundleWarningBagde && hasLowBundles,
          },
        }));
      }
    },
    [
      hasLowBundles,
      fioAddressesLoading,
      showFchBundleWarningBagde,
      warningContent.LOW_BUNDLES.show,
    ],
    !fioAddressesLoading,
  );

  useEffectOnce(
    () => {
      if (!fioAddressesLoading) {
        handleExpiredWarningContent();
      }
    },
    [
      hasExpiredDomain,
      fioAddressesLoading,
      warningContent.EXPIRED_DOMAINS.show,
    ],
    !fioAddressesLoading,
  );

  const onBuyFioHandleAction = useCallback(
    () => history.push(ROUTES.FIO_ADDRESSES_SELECTION),
    [],
  );

  return {
    emptyStateContent: EMPTY_STATE_CONTENT,
    warningContent: [
      {
        ...warningContent.LOW_BUNDLES,
        onClose: onFchBundleWarningBadgeClose,
      },
      {
        ...warningContent.EXPIRED_DOMAINS,
        onClose: onExpiredDomainWarningBadgeClose,
      },
    ],
    handleAddBundles,
    onBuyFioHandleAction,
  };
};

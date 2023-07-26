import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getFee } from '../../redux/fio/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import { fees as feesSelector } from '../../redux/fio/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';

import apis from '../../api';

import { DEFAULT_FEE_PRICES, convertFioPrices } from '../../util/prices';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import { checkIsDomainItemExistsOnCart } from '../../util/fio';
import { addCartItem } from '../../util/cart';

import {
  CART_ITEM_TYPE,
  ANALYTICS_EVENT_ACTIONS,
} from '../../constants/common';
import { ACTIONS, DOMAIN_TYPE } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';

import { CartItem, DomainWatchlistItem } from '../../types';
import useEffectOnce from '../../hooks/general';

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

const SUCCESS_MESSAGES = {
  CREATE_DOMAIN_WATCHLIST_ITEM: 'The domain was added to your watchlist',
  DELETE_DOMAIN_WATCHLIST_ITEM: 'The domain was deleted from your watchlist',
};

type UseContextProps = {
  domainWatchlistLoading: boolean;
  domainsWatchlistList: DomainWatchlistItem[];
  emptyStateContent: {
    title: string;
    message: string;
  };
  prices: {
    costFio: string;
    costUsdc: string;
  };
  selectedDomainWatchlistItem: DomainWatchlistItem;
  showAddDomainWatchlistModal: boolean;
  successMessage: string | null;
  warningContent: {
    title: string;
    message: string;
  };
  closeDomainWatchlistModal: () => void;
  domainWatchlistItemCreate: (domain: string) => void;
  domainWatchlistItemDelete: (id: string) => void;
  handleRenewDomain: (name: string) => void;
  onBagdeClose: () => void;
  onPurchaseButtonClick: (domain: string) => void;
  openDomainWatchlistModal: () => void;
  setSelectedDomainWatchlistItem: (
    domainWatchlistItem: DomainWatchlistItem,
  ) => void;
};

export const useContext = (): UseContextProps => {
  const cartItems = useSelector(cartItemsSelector);
  const fees = useSelector(feesSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);

  const dispatch = useDispatch();
  const history = useHistory();

  const [domainWatchlistLoading, toggleDomainWatchlistLoading] = useState<
    boolean
  >(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [domainsWatchlistList, setDomainsWatchlistList] = useState<
    DomainWatchlistItem[]
  >([]);
  const [
    selectedDomainWatchlistItem,
    setSelectedDomainWatchlistItem,
  ] = useState<DomainWatchlistItem | null>(null);

  const [
    showAddDomainWatchlistModal,
    toggleShowAddDomainWatchlistModal,
  ] = useState<boolean>(false);

  const cartItemsJSON = JSON.stringify(cartItems);

  const renewDomainFeePrice =
    fees[apis.fio.actionEndPoints.renewFioDomain] || DEFAULT_FEE_PRICES;

  const {
    nativeFio: { domain: nativeFioDomainPrice },
  } = prices;

  const { fio, usdc } = convertFioPrices(nativeFioDomainPrice, roe);

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

  const onBagdeClose = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const openDomainWatchlistModal = useCallback(() => {
    toggleShowAddDomainWatchlistModal(true);
  }, []);
  const closeDomainWatchlistModal = useCallback(() => {
    toggleShowAddDomainWatchlistModal(false);
  }, []);

  const onPurchaseButtonClick = useCallback(
    domain => {
      const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);
      const existingCartItem = parsedCartItems.find(cartItem =>
        checkIsDomainItemExistsOnCart(domain, cartItem),
      );

      if (existingCartItem) return history.push(ROUTES.CART);

      const newCartItem = {
        id: domain,
        domain,
        costFio: fio,
        costUsdc: usdc,
        costNativeFio: nativeFioDomainPrice,
        domainType: DOMAIN_TYPE.CUSTOM,
        period: 1,
        type: CART_ITEM_TYPE.DOMAIN,
      };

      addCartItem(newCartItem);
      return history.push(ROUTES.CART);
    },
    [cartItemsJSON, fio, history, nativeFioDomainPrice, usdc],
  );

  const getDomainsWatchlistList = useCallback(async () => {
    try {
      toggleDomainWatchlistLoading(true);

      const domainsWatchlist = await apis.domainsWatchlist.list();

      setDomainsWatchlistList(domainsWatchlist);

      toggleDomainWatchlistLoading(false);
    } catch (err) {
      toggleDomainWatchlistLoading(false);
    }
  }, []);

  const domainWatchlistItemCreate = useCallback(
    async domain => {
      toggleDomainWatchlistLoading(true);
      try {
        await apis.domainsWatchlist.create(domain);
        await getDomainsWatchlistList();

        toggleDomainWatchlistLoading(false);
        setSuccessMessage(SUCCESS_MESSAGES.CREATE_DOMAIN_WATCHLIST_ITEM);
        closeDomainWatchlistModal();
      } catch (err) {
        toggleDomainWatchlistLoading(false);
      }
    },
    [closeDomainWatchlistModal, getDomainsWatchlistList],
  );

  const domainWatchlistItemDelete = useCallback(
    async (id: string) => {
      toggleDomainWatchlistLoading(true);

      try {
        await apis.domainsWatchlist.delete(id);
        await getDomainsWatchlistList();

        toggleDomainWatchlistLoading(false);
        setSuccessMessage(SUCCESS_MESSAGES.DELETE_DOMAIN_WATCHLIST_ITEM);
      } catch (err) {
        toggleDomainWatchlistLoading(false);
      }
    },
    [getDomainsWatchlistList],
  );

  useEffect(() => {
    dispatch(getFee(apis.fio.actionEndPoints.renewFioDomain));
  }, [dispatch]);

  useEffectOnce(() => {
    getDomainsWatchlistList();
  }, []);

  return {
    domainWatchlistLoading,
    domainsWatchlistList,
    emptyStateContent: EMPTY_STATE_CONTENT,
    prices: {
      costFio: fio,
      costUsdc: usdc,
    },
    selectedDomainWatchlistItem,
    showAddDomainWatchlistModal,
    successMessage,
    warningContent: WARNING_CONTENT.DOMAIN_RENEW,
    closeDomainWatchlistModal,
    domainWatchlistItemCreate,
    domainWatchlistItemDelete,
    handleRenewDomain,
    onBagdeClose,
    onPurchaseButtonClick,
    openDomainWatchlistModal,
    setSelectedDomainWatchlistItem,
  };
};

import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getFee, toggleExpiredDomainBadge } from '../../redux/fio/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import {
  fees as feesSelector,
  showExpiredDomainWarningBadge as showExpiredDomainWarningBadgeSelector,
} from '../../redux/fio/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { fioDomains as fioDomainsSelector } from '../../redux/fio/selectors';

import apis from '../../api';

import { DEFAULT_FEE_PRICES, convertFioPrices } from '../../util/prices';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import {
  checkIsDomainItemExistsOnCart,
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../util/fio';
import { addCartItem } from '../../util/cart';
import { log } from '../../util/general';
import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';

import {
  CART_ITEM_TYPE,
  ANALYTICS_EVENT_ACTIONS,
} from '../../constants/common';
import {
  ACTIONS,
  DOMAIN_TYPE,
  FIO_ORACLE_ACCOUNT_NAME,
} from '../../constants/fio';
import { ROUTES } from '../../constants/routes';
import {
  EMPTY_STATE_CONTENT,
  SUCCESS_MESSAGES,
  WARNING_CONTENT,
} from './constants';

import {
  CartItem,
  DomainWatchlistItem,
  FioDomainDoublet,
  FioNameItemProps,
} from '../../types';
import { FioDomainDoubletResponse } from '../../api/responses';
import { WarningContentItem } from '../../components/ManagePageContainer/types';

type UseContextProps = {
  domainWatchlistIsDeleting: boolean;
  domainWatchlistLoading: boolean;
  domainsWatchlistList: FioNameItemProps[];
  emptyStateContent: {
    title: string;
    message: string;
  };
  isDesktop: boolean;
  prices: {
    costFio: string;
    costUsdc: string;
  };
  selectedDomainWatchlistItem: FioNameItemProps;
  selectedDomainWatchlistSettingsItem: Partial<FioNameItemProps>;
  showDangerModal: boolean;
  showDomainWatchlistItemModal: boolean;
  showDomainWatchlistSettingsModal: boolean;
  showAddDomainWatchlistModal: boolean;
  successMessage: string | null;
  warningContent: WarningContentItem[];
  closeDomainWatchlistModal: () => void;
  domainWatchlistItemCreate: (domain: string) => void;
  handleRenewDomain: (name: string) => void;
  onBagdeClose: () => void;
  onDangerModalAction: (id: string) => void;
  onDangerModalClose: () => void;
  onDangerModalOpen: () => void;
  onDomainWatchlistItemModalClose: () => void;
  onDomainWatchlistItemModalOpen: (fioNameItem: FioNameItemProps) => void;
  onPurchaseButtonClick: (domain: string) => void;
  onDomainWatchlistItemSettingsClose: () => void;
  onDomainWatchlistItemSettingsOpen: ({
    fioNameItem,
  }: {
    fioNameItem: Partial<FioNameItemProps>;
  }) => void;
  openDomainWatchlistModal: () => void;
  setSelectedDomainWatchlistItem: (
    domainWatchlistItem: DomainWatchlistItem,
  ) => void;
  sessionBadgeClose: () => void;
};

export const useContext = (): UseContextProps => {
  const cartItems = useSelector(cartItemsSelector);
  const fees = useSelector(feesSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const showWarningMessage = useSelector(showExpiredDomainWarningBadgeSelector);
  const fioDomains = useSelector(fioDomainsSelector);

  const dispatch = useDispatch();
  const history = useHistory();

  const [domainWatchlistLoading, toggleDomainWatchlistLoading] = useState<
    boolean
  >(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [domainsWatchlistList, setDomainsWatchlistList] = useState<
    FioNameItemProps[]
  >([]);
  const [
    selectedDomainWatchlistItem,
    setSelectedDomainWatchlistItem,
  ] = useState<FioNameItemProps | null>(null);
  const [showDomainWatchlistItemModal, handleShowModal] = useState(false);
  const [showDomainWatchlistSettingsModal, handleShowSettings] = useState(
    false,
  );
  const [
    showAddDomainWatchlistModal,
    toggleShowAddDomainWatchlistModal,
  ] = useState<boolean>(false);
  const [
    selectedDomainWatchlistSettingsItem,
    setSelectedDomainWatchlistSettingsItem,
  ] = useState<Partial<FioNameItemProps> | null>(null);
  const [domainWatchlistIsDeleting, toggleDomainWatchlistIsDeleting] = useState<
    boolean
  >(false);
  const [showDangerModal, toggleDangerModal] = useState<boolean>(false);
  const [
    showWarningDomainExpireBadge,
    toggleShowWarningDomainExpireBadge,
  ] = useState<boolean>(false);
  const [
    showWarningDomainWatchListBadge,
    toggleShowWarningDomainWatchListBadge,
  ] = useState<boolean>(false);
  const [
    showWarningDomainExpireIn30DaysBadge,
    toggleShowWarningDomainExpireIn30DaysBadge,
  ] = useState<boolean>(false);

  const isDesktop = useCheckIfDesktop();

  const cartItemsJSON = JSON.stringify(cartItems);
  const fioDomainsJSON = JSON.stringify(fioDomains);

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
      dispatch(addItemToCart(newCartItem));
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
      dispatch,
      history,
      renewDomainFeePrice.fio,
      renewDomainFeePrice?.nativeFio,
      renewDomainFeePrice.usdc,
    ],
  );

  const onDomainWatchlistItemModalOpen = useCallback(
    (fioNameItem: FioNameItemProps) => {
      setSelectedDomainWatchlistItem(fioNameItem);
      handleShowModal(true);
    },
    [],
  );
  const onDomainWatchlistItemModalClose = useCallback(
    () => handleShowModal(false),
    [],
  );

  const onDomainWatchlistItemSettingsOpen = useCallback(
    ({ fioNameItem }: { fioNameItem: Partial<FioNameItemProps> }) => {
      setSelectedDomainWatchlistSettingsItem(fioNameItem);
      handleShowModal(false);
      handleShowSettings(true);
    },
    [],
  );
  const onDomainWatchlistItemSettingsClose = useCallback(() => {
    !isDesktop && handleShowModal(true);
    handleShowSettings(false);
  }, [isDesktop]);

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

      const domainsWatchlistItems: FioNameItemProps[] = [];

      for (const domainsWatchlistItem of domainsWatchlist) {
        const tableRowsParams = apis.fio.setTableRowsParams(
          domainsWatchlistItem.domain,
        );

        try {
          const {
            rows,
          }: { rows: FioDomainDoubletResponse[] } = await apis.fio.getTableRows(
            tableRowsParams,
          );

          if (rows.length) {
            const { account, expiration, name, is_public } = rows[0];

            let walletPublicKey = '';
            const domainsWatchlistItemToAdd = {
              account: '',
              id: name,
              domainsWatchlistItemId: domainsWatchlistItem.id,
              expiration,
              name,
              isPublic: is_public,
              walletPublicKey: '',
            };

            if (account !== FIO_ORACLE_ACCOUNT_NAME) {
              const publicKey = await apis.fio.getAccountPubKey(account);
              walletPublicKey = publicKey;
            }

            if (!walletPublicKey) {
              domainsWatchlistItemToAdd.account = account;
            }

            domainsWatchlistItemToAdd.walletPublicKey = walletPublicKey;
            domainsWatchlistItems.push(domainsWatchlistItemToAdd);
          }
        } catch (err) {
          log.error(err);
        }
      }

      setDomainsWatchlistList(domainsWatchlistItems);

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

        closeDomainWatchlistModal();
        toggleDomainWatchlistLoading(false);
        setSuccessMessage(SUCCESS_MESSAGES.CREATE_DOMAIN_WATCHLIST_ITEM);
      } catch (err) {
        toggleDomainWatchlistLoading(false);
      }
    },
    [closeDomainWatchlistModal, getDomainsWatchlistList],
  );

  const domainWatchlistItemDelete = useCallback(
    async (id: string) => {
      toggleDomainWatchlistIsDeleting(true);

      try {
        await apis.domainsWatchlist.delete(id);
        await getDomainsWatchlistList();

        toggleDomainWatchlistIsDeleting(false);
        setSuccessMessage(SUCCESS_MESSAGES.DELETE_DOMAIN_WATCHLIST_ITEM);
        handleShowSettings(false);
      } catch (err) {
        toggleDomainWatchlistIsDeleting(false);
      }
    },
    [getDomainsWatchlistList],
  );

  const sessionBadgeClose = useCallback(() => {
    dispatch(toggleExpiredDomainBadge(false));
  }, [dispatch]);

  const onDangerModalOpen = useCallback(() => {
    toggleDangerModal(true);
  }, []);

  const onDangerModalClose = useCallback(() => {
    toggleDangerModal(false);
  }, []);

  const onDangerModalAction = useCallback(
    (id: string) => {
      onDangerModalClose();
      domainWatchlistItemDelete(id);
    },
    [domainWatchlistItemDelete, onDangerModalClose],
  );

  useEffect(() => {
    dispatch(getFee(apis.fio.actionEndPoints.renewFioDomain));
  }, [dispatch]);

  useEffectOnce(() => {
    getDomainsWatchlistList();
  }, []);

  useEffect(() => {
    if (domainsWatchlistList.length) {
      const domainWatchListHasExpiredDomain = domainsWatchlistList.some(
        domainWatchListItem =>
          isDomainExpired(
            domainWatchListItem.name,
            domainWatchListItem.expiration,
          ),
      );

      toggleShowWarningDomainWatchListBadge(domainWatchListHasExpiredDomain);
    }
  }, [domainsWatchlistList]);

  useEffect(() => {
    if (fioDomainsJSON) {
      const fioDomainsParsed: FioDomainDoublet[] = JSON.parse(fioDomainsJSON);

      const hasExpiredIn30Days = fioDomainsParsed.some(
        fioDomain =>
          fioDomain.expiration &&
          isDomainWillExpireIn30Days(fioDomain.name, fioDomain.expiration),
      );

      const hasExpired = fioDomainsParsed.some(
        fioDomain =>
          fioDomain.expiration &&
          isDomainExpired(fioDomain.name, fioDomain.expiration),
      );

      toggleShowWarningDomainExpireBadge(hasExpired);
      toggleShowWarningDomainExpireIn30DaysBadge(hasExpiredIn30Days);
    }
  }, [fioDomainsJSON]);

  const warningContnet =
    showWarningDomainExpireIn30DaysBadge && !showWarningDomainExpireBadge
      ? WARNING_CONTENT.DOMAIN_RENEW_IN_30_DAYS
      : WARNING_CONTENT.DOMAIN_RENEW;

  return {
    domainWatchlistIsDeleting,
    domainWatchlistLoading,
    domainsWatchlistList,
    emptyStateContent: EMPTY_STATE_CONTENT,
    isDesktop,
    prices: {
      costFio: fio,
      costUsdc: usdc,
    },
    selectedDomainWatchlistItem,
    selectedDomainWatchlistSettingsItem,
    showDangerModal,
    showDomainWatchlistItemModal,
    showDomainWatchlistSettingsModal,
    showAddDomainWatchlistModal,
    successMessage,
    warningContent: [
      {
        ...warningContnet,
        show:
          showWarningMessage &&
          (showWarningDomainExpireBadge ||
            showWarningDomainExpireIn30DaysBadge ||
            showWarningDomainWatchListBadge),
        onClose: sessionBadgeClose,
      },
    ],
    closeDomainWatchlistModal,
    domainWatchlistItemCreate,
    handleRenewDomain,
    onBagdeClose,
    onDangerModalAction,
    onDangerModalClose,
    onDangerModalOpen,
    onDomainWatchlistItemModalClose,
    onDomainWatchlistItemModalOpen,
    onPurchaseButtonClick,
    onDomainWatchlistItemSettingsClose,
    onDomainWatchlistItemSettingsOpen,
    openDomainWatchlistModal,
    setSelectedDomainWatchlistItem,
    sessionBadgeClose,
  };
};

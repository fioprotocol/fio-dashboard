import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Account, EndPoint } from '@fioprotocol/fiosdk';

import { getFee, toggleExpiredDomainBadge } from '../../redux/fio/actions';
import {
  addItem as addItemToCart,
  onDomainRenew,
} from '../../redux/cart/actions';

import { showExpiredDomainWarningBadge as showExpiredDomainWarningBadgeSelector } from '../../redux/fio/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { fioDomains as fioDomainsSelector } from '../../redux/fio/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';
import { siteSetings as siteSettingsSelector } from '../../redux/settings/selectors';

import apis from '../../api';

import { handleFullPriceForMultiYearItems } from '../../util/prices';

import {
  checkIsDomainItemExistsOnCart,
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../util/fio';
import { log } from '../../util/general';
import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';

import {
  CART_ITEM_TYPE,
  DEFAULT_CART_ITEM_PERIOD_OPTION,
} from '../../constants/common';
import {
  MAX_DOMAINS_WATCHLIST_ERROR,
  MAX_DOMAINS_WATCHLIST_ERROR_TITLE,
} from '../../constants/errors';
import { DOMAIN_TYPE } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';
import { VARS_KEYS } from '../../constants/vars';
import {
  EMPTY_STATE_CONTENT,
  SUCCESS_MESSAGES,
  WARNING_CONTENT,
} from './constants';
import { DEFAULT_ITEMS_LIMIT } from '../../constants/common';

import {
  CartItem,
  DomainWatchlistItem,
  FioDomainDoublet,
  FioNameItemProps,
} from '../../types';
import { FioDomainDoubletResponse } from '../../api/responses';
import { WarningContentItem } from '../../components/ManagePageContainer/types';
import { showGenericErrorModal } from '../../redux/modal/actions';

type UseContextProps = {
  domainWatchlistIsDeleting: boolean;
  domainWatchlistLoading: boolean;
  domainsWatchlistList: FioNameItemProps[];
  domainWatchlistHasMoreItems: boolean;
  domainWatchlistOnLoadMore: () => void;
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
  handleRenewWatchedDomain: (name: string) => void;
  onBagdeClose: () => void;
  onDangerModalAction: (id: string) => void;
  onDangerModalClose: () => void;
  onBuyDomainAction: () => void;
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
  const prices = useSelector(pricesSelector);
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);
  const siteSettings = useSelector(siteSettingsSelector);
  const showWarningMessage = useSelector(showExpiredDomainWarningBadgeSelector);
  const fioDomains = useSelector(fioDomainsSelector);

  const maxDomainsWatchlist = Number(
    siteSettings[VARS_KEYS.MAX_DOMAINS_WATCHLIST_PER_USER],
  );

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
  const [domainWatchListOffset, setDomainWatchListOffset] = useState(0);
  const [
    domainWatchlistHasMoreItems,
    setHasMoreDomainWatchlistItems,
  ] = useState(true);

  const isDesktop = useCheckIfDesktop();

  const cartItemsJSON = JSON.stringify(cartItems);
  const fioDomainsJSON = JSON.stringify(fioDomains);

  const period = parseFloat(DEFAULT_CART_ITEM_PERIOD_OPTION.id);

  const { fio, usdc } = handleFullPriceForMultiYearItems({
    prices: prices?.nativeFio,
    period,
    roe,
  });

  const renewDomain = useCallback(
    (domain: string, isWatchedDomain = false) => {
      dispatch(onDomainRenew({ domain, isWatchedDomain }));
    },
    [dispatch],
  );

  const handleRenewDomain = (domain: string) => renewDomain(domain);

  const handleRenewWatchedDomain = (domain: string) => {
    const isOwned = !!fioDomains.find(it => it.name === domain);

    renewDomain(domain, !isOwned);
  };

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
    if (
      maxDomainsWatchlist &&
      domainsWatchlistList.length >= maxDomainsWatchlist
    ) {
      dispatch(
        showGenericErrorModal(
          MAX_DOMAINS_WATCHLIST_ERROR(maxDomainsWatchlist),
          MAX_DOMAINS_WATCHLIST_ERROR_TITLE,
          'Close',
        ),
      );
      return;
    }
    toggleShowAddDomainWatchlistModal(true);
  }, [dispatch, domainsWatchlistList.length, maxDomainsWatchlist]);

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

      const period =
        existingCartItem?.period ||
        parseFloat(DEFAULT_CART_ITEM_PERIOD_OPTION.id);

      const {
        fio: costFio,
        usdc: costUsdc,
        costNativeFio,
      } = handleFullPriceForMultiYearItems({
        prices: prices?.nativeFio,
        period,
        roe,
      });

      const newCartItem = {
        id: domain,
        domain,
        costFio,
        costUsdc,
        costNativeFio,
        domainType: DOMAIN_TYPE.CUSTOM,
        period,
        type: CART_ITEM_TYPE.DOMAIN,
      };

      dispatch(
        addItemToCart({
          item: newCartItem,
          refCode,
        }),
      );
      return history.push(ROUTES.CART);
    },
    [cartItemsJSON, dispatch, history, prices?.nativeFio, refCode, roe],
  );

  const getDomainsWatchlistList = useCallback(async () => {
    try {
      toggleDomainWatchlistLoading(true);

      const domainsWatchlist = await apis.domainsWatchlist.list({
        limit: DEFAULT_ITEMS_LIMIT,
        offset: domainWatchListOffset,
      });

      const domainsWatchlistItems: FioNameItemProps[] = [];

      for (const domainsWatchlistItem of domainsWatchlist?.list || []) {
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

            if (account !== Account.oracle) {
              walletPublicKey = await apis.fio.getAccountPubKey(account);
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

      setDomainsWatchlistList([
        ...domainsWatchlistList,
        ...domainsWatchlistItems,
      ]);
      setDomainWatchListOffset(domainWatchListOffset + DEFAULT_ITEMS_LIMIT);
      setHasMoreDomainWatchlistItems(
        domainsWatchlist?.maxCount >
          domainWatchListOffset + DEFAULT_ITEMS_LIMIT,
      );

      toggleDomainWatchlistLoading(false);
    } catch (err) {
      toggleDomainWatchlistLoading(false);
    }
  }, [domainWatchListOffset, domainsWatchlistList]);

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

  const onBuyDomainAction = useCallback(
    () => history.push(ROUTES.FIO_DOMAINS_SELECTION),
    [history],
  );

  const domainWatchlistOnLoadMore = useCallback(() => {
    getDomainsWatchlistList();
  }, [getDomainsWatchlistList]);

  useEffect(() => {
    dispatch(getFee(EndPoint.renewFioDomain));
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
    domainWatchlistHasMoreItems,
    domainWatchlistOnLoadMore,
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
    handleRenewWatchedDomain,
    onBagdeClose,
    onDangerModalAction,
    onDangerModalClose,
    onBuyDomainAction,
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

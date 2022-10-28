import React, { useEffect, useState, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Redirect } from 'react-router-dom';

import LayoutContainer from '../LayoutContainer/LayoutContainer';
import Modal from '../Modal/Modal';
import ManagePageCtaBadge from './ManagePageCtaBadge';
import Notifications from './ManagePageComponents/Notifications';
import DesktopView from './ManagePageComponents/DesktopView';
import ItemComponent from './ManagePageComponents/ItemComponent';
import MobileView from './ManagePageComponents/MobileView';
import SettingsItem from './ManagePageComponents/SettingsItem';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import InfoBadge from '../Badges/InfoBadge/InfoBadge';

import { BANNER_DATA, ITEMS_LIMIT, EXPIRED_DAYS, SUBTITLE } from './constants';
import { FIO_ADDRESS_DELIMITER } from '../../utils';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../constants/fio';

import { useCheckIfDesktop } from '../../screenType';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import { HasMore, ContainerProps } from './types';
import { FioNameItemProps, FioWalletDoublet } from '../../types';

import classes from './ManagePageContainer.module.scss';

const INFO_BADGE_CONTENT = {
  address: {
    title: 'No FIO Crypto Handles',
    message: 'There are no FIO Crypto Handles in all your wallets',
  },
  domain: {
    title: 'No FIO Domains',
    message: 'There are no FIO Domains in all your wallets',
  },
};

const isExpired = (expiration: Date): boolean => {
  const today = new Date();
  return (
    expiration &&
    new Date(expiration) <
      new Date(today.setDate(today.getDate() + EXPIRED_DAYS))
  );
};

const ManagePageContainer: React.FC<ContainerProps> = props => {
  const {
    pageName,
    fioNameList,
    fioWallets,
    getWalletAddresses,
    hasMore,
    loading,
    noProfileLoaded,
    showExpired,
    showBundles,
    showStatus,
    showFioAddressName,
    addBundlesFeePrice,
    renewDomainFeePrice,
    getAddBundlesFee,
    getRenewDomainFee,
    cartItems,
    addItemToCart,
    history,
  } = props;
  const [showWarnBadge, toggleShowWarnBadge] = useState<boolean>(false);
  const [showInfoBadge, toggleShowInfoBadge] = useState<boolean>(false);
  const [offset, changeOffset] = useState<HasMore>({});
  const [show, handleShowModal] = useState(false);
  const [showSettings, handleShowSettings] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<FioNameItemProps>({});
  const [fetchWalletDataIteration, setFetchWalletDataIteration] = useState(0);

  const isDesktop = useCheckIfDesktop();

  const fioWalletsRef = useRef(fioWallets);
  if (!isEqual(fioWallets, fioWalletsRef)) {
    fioWalletsRef.current = fioWallets;
  }

  const hasMoreItems = Object.keys(hasMore).some(key => hasMore[key] > 0);

  const { title } = BANNER_DATA[pageName];

  // Get and handle Fio Crypto Handles or Fio Domains for one specific wallet (public key)
  const handleWalletAddresses = (wallet: FioWalletDoublet, limit: number) => {
    const { publicKey } = wallet;
    const currentOffset = offset[publicKey] || 0;
    getWalletAddresses(publicKey, limit, currentOffset);
    !!hasMore[publicKey] &&
      changeOffset({
        ...offset,
        [publicKey]: currentOffset + Math.round(limit),
      });
  };

  // Get Fio Crypto Handles or Fio Domains from all wallets (public keys) on initial and lazy load
  const getAllWalletsAddresses = () => {
    if (!isEmpty(fioWallets)) {
      let wallets = fioWallets;
      if (fetchWalletDataIteration > 0 && fioWallets.length > 1)
        wallets = fioWallets.filter(
          fioWallet => hasMore[fioWallet.publicKey] > 0,
        );
      for (const wallet of wallets) {
        handleWalletAddresses(wallet, Math.round(ITEMS_LIMIT / wallets.length));
      }
      setFetchWalletDataIteration(fetchWalletDataIteration + 1);
    }
  };

  // Handle loading more Fio Crypto Handles or Fio Domains on initial or lazy load if we have less loaded items than limit count
  useEffect(() => {
    if (
      fetchWalletDataIteration > 0 &&
      hasMoreItems &&
      fioNameList.length % ITEMS_LIMIT !== 0 &&
      fioNameList.length - ITEMS_LIMIT * fetchWalletDataIteration < 0
    ) {
      // Set loading more new limit count to rich the limit count for initial load or lazy load
      const extraLimitCount = ITEMS_LIMIT - (fioNameList.length % ITEMS_LIMIT);
      const hasMoreAddressesWallets = fioWallets.filter(
        fioWallet => hasMore[fioWallet.publicKey] > 0,
      );
      for (const hasMoreWallet of hasMoreAddressesWallets) {
        handleWalletAddresses(
          hasMoreWallet,
          Math.round(extraLimitCount / hasMoreAddressesWallets.length),
        );
      }
    }
  }, [fetchWalletDataIteration, fioNameList.length, hasMoreItems]);

  useEffect(() => {
    toggleShowWarnBadge(
      !!fioNameList &&
        !!showExpired &&
        fioNameList.some(
          dataItem => dataItem.expiration && isExpired(dataItem.expiration),
        ),
    );
    toggleShowInfoBadge(false); // todo: set dependent on data when move to get_pub_addresses
  }, [fioWalletsRef.current]);

  useEffect(() => {
    if (!isEmpty(hasMore)) {
      const offsetObj: HasMore = {};

      Object.keys(hasMore).forEach(key => {
        offsetObj[key] = 0;
      });
      changeOffset(offsetObj);
    }
  }, [fioWalletsRef.current]);

  useEffect(() => {
    getAllWalletsAddresses();
  }, [getAllWalletsAddresses]);

  useEffect(() => {
    getAddBundlesFee && getAddBundlesFee();
    getRenewDomainFee && getRenewDomainFee();
  }, [getAddBundlesFee, getRenewDomainFee]);

  const onItemModalOpen = (fioNameItem: FioNameItemProps) => {
    setCurrentAddress(fioNameItem);
    handleShowModal(true);
  };
  const onItemModalClose = () => handleShowModal(false);

  const onSettingsOpen = (fioNameItem: FioNameItemProps) => {
    setCurrentAddress(fioNameItem);
    handleShowModal(false);
    handleShowSettings(true);
  };
  const onSettingsClose = () => {
    !isDesktop && handleShowModal(true);
    handleShowSettings(false);
  };
  const handleAddBundles = (name: string) => {
    const [address, domain] = name.split(FIO_ADDRESS_DELIMITER);
    const newCartItem = {
      address,
      domain,
      type: CART_ITEM_TYPE.ADD_BUNDLES,
      id: `${name}-${ACTIONS.addBundledTransactions}-${+new Date()}`,
      allowFree: false,
      costNativeFio: addBundlesFeePrice?.nativeFio,
      costFio: addBundlesFeePrice.fio,
      costUsdc: addBundlesFeePrice.usdc,
    };

    addItemToCart(newCartItem);
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
      getCartItemsDataForAnalytics([...cartItems, newCartItem]),
    );
    history.push(ROUTES.CART);
  };

  const handleRenewDomain = (domain: string) => {
    const newCartItem = {
      domain,
      type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
      id: `${domain}-${ACTIONS.renewFioDomain}-${+new Date()}`,
      allowFree: false,
      costNativeFio: renewDomainFeePrice?.nativeFio,
      costFio: renewDomainFeePrice.fio,
      costUsdc: renewDomainFeePrice.usdc,
    };

    addItemToCart(newCartItem);
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
      getCartItemsDataForAnalytics([...cartItems, newCartItem]),
    );
    history.push(ROUTES.CART);
  };

  const propsToComponents = {
    fioNameList,
    isDesktop,
    pageName,
    showInfoBadge,
    isExpired,
    toggleShowInfoBadge,
    toggleShowWarnBadge,
    onItemModalOpen,
    onSettingsOpen,
    showExpired,
    showBundles,
    showStatus,
    showFioAddressName,
    onAddBundles: handleAddBundles,
    onRenewDomain: handleRenewDomain,
  };

  if (noProfileLoaded) return <Redirect to={{ pathname: ROUTES.HOME }} />;

  const renderList = () => {
    if ((!fioNameList || fioNameList.length === 0) && !loading)
      return (
        <InfoBadge
          title={INFO_BADGE_CONTENT[pageName].title}
          message={INFO_BADGE_CONTENT[pageName].message}
        />
      );
    if (isDesktop) return <DesktopView {...propsToComponents} />;
    return <MobileView {...propsToComponents} />;
  };

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <p className={classes.subtitle}>{SUBTITLE[pageName]}</p>
          {isDesktop && (
            <Notifications
              showWarnBadge={showWarnBadge}
              showInfoBadge={showInfoBadge}
              toggleShowWarnBadge={toggleShowWarnBadge}
              toggleShowInfoBadge={toggleShowInfoBadge}
              pageName={pageName}
            />
          )}
          <InfiniteScroll
            loading={loading}
            hasNextPage={hasMoreItems}
            onLoadMore={getAllWalletsAddresses}
          >
            {renderList()}
          </InfiniteScroll>
        </div>
      </LayoutContainer>
      <div className={classes.actionBadge}>
        <ManagePageCtaBadge name={pageName} />
      </div>
      <Modal
        show={show}
        onClose={onItemModalClose}
        hideCloseButton={false}
        closeButton={true}
        isSimple={true}
      >
        <ItemComponent
          {...propsToComponents}
          fioNameItem={currentAddress}
          showWarnBadge={showWarnBadge}
        />
      </Modal>
      <Modal
        show={showSettings}
        onClose={onSettingsClose}
        hideCloseButton={false}
        closeButton={true}
        isSimple={true}
        isWide={isDesktop}
        hasDefaultCloseColor={true}
      >
        <SettingsItem
          fioNameItem={currentAddress}
          pageName={pageName}
          fioWallets={fioWallets}
          showStatus={showStatus}
        />
      </Modal>
    </div>
  );
};

export default ManagePageContainer;

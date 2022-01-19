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

import { BANNER_DATA, ITEMS_LIMIT, EXPIRED_DAYS, SUBTITLE } from './constants';
import { useCheckIfDesktop } from '../../screenType';
import { ROUTES } from '../../constants/routes';

import { HasMore, ContainerProps, BoolStateFunc } from './types';
import { FioNameItemProps } from '../../types';

import classes from './ManagePageContainer.module.scss';

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
    fetchDataFn,
    hasMore,
    loading,
    noProfileLoaded,
    showExpired,
    showBundles,
    showStatus,
    showFioAddressName,
  } = props;
  const [showWarnBadge, toggleShowWarnBadge] = useState<BoolStateFunc>(false);
  const [showInfoBadge, toggleShowInfoBadge] = useState<BoolStateFunc>(false);
  const [offset, changeOffset] = useState<HasMore>({});
  const [show, handleShowModal] = useState(false);
  const [showSettings, handleShowSettings] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<FioNameItemProps>({});

  const isDesktop = useCheckIfDesktop();

  const fioWalletsRef = useRef(fioWallets);
  if (!isEqual(fioWallets, fioWalletsRef)) {
    fioWalletsRef.current = fioWallets;
  }

  const hasMoreItems = Object.keys(hasMore).some(key => hasMore[key] > 0);

  const { title } = BANNER_DATA[pageName];

  const fetchData = () => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        const { publicKey } = fioWallet;
        const currentOffset = offset[publicKey] || 0;
        fetchDataFn(
          publicKey,
          Math.round(ITEMS_LIMIT / fioWallets.length),
          currentOffset,
        );
        !!hasMore[publicKey] &&
          changeOffset({
            ...offset,
            [publicKey]: currentOffset + ITEMS_LIMIT,
          });
      }
    }
  };

  useEffect(() => {
    toggleShowWarnBadge(
      fioNameList &&
        showExpired &&
        fioNameList.some(dataItem => isExpired(dataItem.expiration)),
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
    fetchData();
  }, [fioWalletsRef.current]);

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
  };

  if (noProfileLoaded) return <Redirect to={{ pathname: ROUTES.HOME }} />;

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
            onLoadMore={fetchData}
          >
            {isDesktop ? (
              <DesktopView {...propsToComponents} />
            ) : (
              <MobileView {...propsToComponents} />
            )}
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

import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Redirect } from 'react-router-dom';

import LayoutContainer from '../LayoutContainer/LayoutContainer';
import Modal from '../Modal/Modal';
import { BANNER_DATA, ITEMS_LIMIT, EXPIRED_DAYS, PAGE_NAME } from './constants';
import ManagePageCtaBadge from './ManagePageCtaBadge';
import { useCheckIfDesktop } from '../../screenType';
import { ROUTES } from '../../constants/routes';

import {
  DesktopComponents,
  MobileComponents,
  RenderItemComponent,
  RenderNotifications,
  RenderItemSettings,
} from './ManagePageComponents';

import classes from './ManagePageContainer.module.scss';

import { HasMore, ContainerProps, BoolStateFunc } from './types';
import { FioNameItemProps } from '../../types';
import { fioNameLabels } from '../../constants/labels';

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
        fetchDataFn(publicKey, Math.round(ITEMS_LIMIT), currentOffset);
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

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMoreItems,
    onLoadMore: fetchData,
    rootMargin: '0px 0px 20px 0px',
  });

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
  const onClickSignature = (fioNameItem: FioNameItemProps) => {
    console.debug('Go to Signature list');
  };
  const renderScroll = (children: React.ReactNode) => {
    return (
      <>
        {children}
        {(loading || Object.keys(hasMore).some(key => hasMore[key] > 0)) && (
          <div className={classes.loader} ref={sentryRef}>
            <FontAwesomeIcon
              icon="spinner"
              spin={true}
              className={classes.loaderIcon}
            />
          </div>
        )}
      </>
    );
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
    onClickSignature,
  };

  if (noProfileLoaded) return <Redirect to={{ pathname: ROUTES.HOME }} />;

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <p className={classes.subtitle}>
            {pageName === PAGE_NAME.ADDRESS
              ? `FIO ${fioNameLabels[pageName]}es owned by all your wallets.`
              : pageName === PAGE_NAME.DOMAIN
              ? `FIO ${fioNameLabels[pageName]}s owned by all your wallets.`
              : null}
          </p>
          {isDesktop &&
            RenderNotifications({
              showWarnBadge,
              showInfoBadge,
              toggleShowWarnBadge,
              toggleShowInfoBadge,
              pageName,
            })}
          <div className={classes.tableContainer}>
            {isDesktop
              ? renderScroll(<DesktopComponents {...propsToComponents} />)
              : renderScroll(<MobileComponents {...propsToComponents} />)}
          </div>
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
        <RenderItemComponent
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
        hasDefaultColor={true}
      >
        <RenderItemSettings
          fioNameItem={currentAddress}
          pageName={pageName}
          fioWallets={fioWallets}
        />
      </Modal>
    </div>
  );
};

export default ManagePageContainer;

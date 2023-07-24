import React, { useEffect, useState } from 'react';

import isEmpty from 'lodash/isEmpty';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import { Fio101Component } from '../Fio101Component';
import { WelcomeComponent } from '../../pages/DashboardPage/components/WelcomeComponent';
import { ListItemsComponent } from './ManagePageComponents/ListItemsComponent';
import LayoutContainer from '../LayoutContainer/LayoutContainer';
import Modal from '../Modal/Modal';
import NotificationBadge from '../NotificationBadge';
import { BADGE_TYPES } from '../Badge/Badge';

import { DesktopView } from './ManagePageComponents/DesktopView';
import {
  DomainItemComponent,
  FchItemComponent,
} from './ManagePageComponents/ItemComponent';
import { MobileView } from './ManagePageComponents/MobileView';
import {
  FchSettingsItem,
  DomainSettingsItem,
} from './ManagePageComponents/SettingsItem';

import {
  getAllFioPubAddresses,
  refreshBalance,
  refreshFioNames,
} from '../../redux/fio/actions';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioDomains as fioDomainsSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
  walletsFioAddressesLoading as walletsFioAddressesLoadingSelector,
} from '../../redux/fio/selectors';
import { loading as edgeLoadingSelector } from '../../redux/edge/selectors';

import { ITEMS_LIMIT, PAGE_NAME, WELCOME_COMPONENT_TYPE } from './constants';
import { ROUTES } from '../../constants/routes';
import { LOW_BUNDLES_THRESHOLD } from '../../constants/fio';

import { isDomainExpired } from '../../util/fio';
import useEffectOnce from '../../hooks/general';

import { useContext } from './ManagePageContainerContext';

import { ContainerProps } from './types';
import { FioNameItemProps } from '../../types';

import classes from './ManagePageContainer.module.scss';

export const ManagePageContainer: React.FC<ContainerProps> = props => {
  const {
    emptyStateContent,
    pageName,
    title,
    warningContent,
    handleAddBundles,
    handleRenewDomain,
  } = props;
  const { fioWallets, isDesktop, loading, noProfileLoaded } = useContext();

  const isAddress = pageName === PAGE_NAME.ADDRESS;
  const isDomain = pageName === PAGE_NAME.DOMAIN;

  const [showWarnBadge, toggleShowWarnBadge] = useState<boolean>(false);
  const [show, handleShowModal] = useState(false);
  const [showSettings, handleShowSettings] = useState(false);
  const [selectedFioNameItem, selectFioNameItem] = useState<FioNameItemProps>(
    {},
  );
  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_LIMIT);
  const edgeLoading = useSelector(edgeLoadingSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const fioDomains = useSelector(fioDomainsSelector);
  const fioLoading = useSelector(fioLoadingSelector);
  const fioAddressesLoading = useSelector(fioAddressesLoadingSelector);
  const walletsFioAddressesLoading = useSelector(
    walletsFioAddressesLoadingSelector,
  );
  const mappedPublicAddresses = useSelector(mappedPublicAddressesSelector);

  const dispatch = useDispatch();

  const hasFCH = fioAddresses?.length > 0;
  const hasOneFCH = fioAddresses?.length === 1;

  const hasDomains = fioDomains?.length > 0;

  const noMappedPubAddresses =
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    );

  const firstFromListFioAddressName = fioAddresses[0]?.name;

  const FIO101Loading =
    fioLoading ||
    edgeLoading ||
    fioAddressesLoading ||
    walletsFioAddressesLoading;

  let fioNameList: FioNameItemProps[] = [];
  if (isAddress) fioNameList = fioAddresses;
  if (isDomain) fioNameList = fioDomains;

  const hasNextPage = visibleItemsCount < fioNameList.length;

  useEffect(() => {
    if (isAddress) {
      toggleShowWarnBadge(
        !!fioAddresses &&
          fioAddresses.some(
            fioAddress => fioAddress.remaining < LOW_BUNDLES_THRESHOLD,
          ),
      );
    }
    if (isDomain) {
      toggleShowWarnBadge(
        !!fioDomains &&
          fioDomains.some(
            fioDomain =>
              fioDomain.expiration &&
              isDomainExpired(fioDomain.name, fioDomain.expiration),
          ),
      );
    }
  }, [fioAddresses, fioDomains, isAddress, isDomain]);

  useEffectOnce(
    () => {
      for (const { publicKey } of fioWallets) {
        dispatch(refreshBalance(publicKey));
        dispatch(refreshFioNames(publicKey));
      }
    },
    [fioWallets, dispatch],
    fioWallets.length > 0,
  );

  useEffectOnce(
    () => {
      for (const fioAddress of fioAddresses) {
        dispatch(getAllFioPubAddresses(fioAddress.name, 0, 0));
      }
    },
    [dispatch, fioAddresses],
    fioAddresses.length > 0,
  );

  const loadMore = () => {
    setVisibleItemsCount(visibleItemsCount + ITEMS_LIMIT);
  };

  const onItemModalOpen = (fioNameItem: FioNameItemProps) => {
    selectFioNameItem(fioNameItem);
    handleShowModal(true);
  };
  const onItemModalClose = () => handleShowModal(false);

  const onSettingsOpen = (fioNameItem: FioNameItemProps) => {
    selectFioNameItem(fioNameItem);
    handleShowModal(false);
    handleShowSettings(true);
  };
  const onSettingsClose = () => {
    !isDesktop && handleShowModal(true);
    handleShowSettings(false);
  };

  const listItemsDefaultProps = {
    fioNameList: fioNameList.slice(
      0,
      !hasNextPage ? fioNameList.length : visibleItemsCount,
    ),
    isAddress,
    pageName,
  };

  if (noProfileLoaded) return <Redirect to={{ pathname: ROUTES.HOME }} />;

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <NotificationBadge
            type={BADGE_TYPES.WARNING}
            title={warningContent.title}
            message={warningContent.message}
            show={showWarnBadge}
            withoutMargin
            onClose={() => toggleShowWarnBadge(false)}
          />
          <InfiniteScroll
            loading={loading}
            hasNextPage={hasNextPage}
            onLoadMore={loadMore}
          >
            <ListItemsComponent
              isEmpty={(!fioNameList || fioNameList.length === 0) && !loading}
              emptyStateContent={emptyStateContent}
              listItems={
                isDesktop ? (
                  <DesktopView
                    {...listItemsDefaultProps}
                    onAddBundles={handleAddBundles}
                    onSettingsOpen={onSettingsOpen}
                    onRenewDomain={handleRenewDomain}
                  />
                ) : (
                  <MobileView
                    {...listItemsDefaultProps}
                    onItemModalOpen={onItemModalOpen}
                  />
                )
              }
            />
          </InfiniteScroll>
        </div>
        <WelcomeComponent
          type={WELCOME_COMPONENT_TYPE[pageName]}
          onlyActions
          noPaddingTop
        />
      </LayoutContainer>
      <div className={classes.actionBadge}>
        <Fio101Component
          firstFromListFioAddressName={firstFromListFioAddressName}
          hasFCH={hasFCH}
          hasOneFCH={hasOneFCH}
          hasDomains={hasDomains}
          hideTitle
          isDesktop={isDesktop}
          loading={FIO101Loading}
          noMappedPubAddresses={noMappedPubAddresses}
          useMobileView
        />
      </div>
      <Modal
        show={show}
        onClose={onItemModalClose}
        hideCloseButton={false}
        closeButton
        isSimple
      >
        {isAddress ? (
          <FchItemComponent
            fioNameItem={selectedFioNameItem}
            warningContent={warningContent}
            onAddBundles={handleAddBundles}
            onSettingsOpen={onSettingsOpen}
          />
        ) : (
          <DomainItemComponent
            fioNameItem={selectedFioNameItem}
            warningContent={warningContent}
            onRenewDomain={handleRenewDomain}
            onSettingsOpen={onSettingsOpen}
          />
        )}
      </Modal>
      <Modal
        show={showSettings}
        onClose={onSettingsClose}
        hideCloseButton={false}
        closeButton
        isSimple
        isWide={isDesktop}
        hasDefaultCloseColor
      >
        {isAddress ? (
          <FchSettingsItem
            fioNameItem={selectedFioNameItem}
            fioWallets={fioWallets}
          />
        ) : (
          <DomainSettingsItem
            fioNameItem={selectedFioNameItem}
            fioWallets={fioWallets}
          />
        )}
      </Modal>
    </div>
  );
};

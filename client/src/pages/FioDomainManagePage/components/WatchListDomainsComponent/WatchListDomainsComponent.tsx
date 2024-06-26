import React, { useCallback } from 'react';

import { Link } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReplayIcon from '@mui/icons-material/Replay';

import { ListItemsComponent } from '../../../../components/ManagePageContainer/components/ListItemsComponent';
import {
  DesktopView,
  MobileView,
} from '../../../../components/ManagePageContainer/components/ItemsScreenView';
import Modal from '../../../../components/Modal/Modal';
import DangerModal from '../../../../components/Modal/DangerModal';
import { ActionButton } from '../../../../components/common/ActionButton';
import { DomainItemComponent } from '../../../../components/ManagePageContainer/components/ItemCopmonent';
import { DomainsWatchlistSettingsItem } from '../../../../components/ManagePageContainer/components/SettingsItem';

import { AddDomainToWatchListModal } from '../AddDomainToWatchListModal';
import { ListNameTitle } from '../ListNameTitle';

import { ROUTES } from '../../../../constants/routes';

import { FioNameItemProps, FioNameType } from '../../../../types';

import classes from './WatchListDomainsComponent.module.scss';

type Props = {
  domainsWatchlistList: FioNameItemProps[];
  domainWatchlistLoading: boolean;
  isDesktop: boolean;
  domainWatchlistIsDeleting: boolean;
  pageName: FioNameType;
  prices: {
    costFio: string;
    costUsdc: string;
  };
  selectedFioNameItem: FioNameItemProps;
  selectedDomainWatchlistSettingsItem: Partial<FioNameItemProps>;
  showAddDomainWatchlistModal: boolean;
  showDangerModal: boolean;
  showItemModal: boolean;
  showSettingsModal: boolean;
  closeDomainWatchlistModal: () => void;
  domainWatchlistItemCreate: (domain: string) => void;
  handleRenewDomain?: (name: string) => void;
  onDangerModalAction: (id: string) => void;
  onDangerModalClose: () => void;
  onDangerModalOpen: () => void;
  onItemModalClose: () => void;
  onItemModalOpen: (fioNameItem: FioNameItemProps) => void;
  onPurchaseButtonClick: (domain: string) => void;
  onSettingsClose: () => void;
  onSettingsOpen: ({
    fioNameItem,
  }: {
    fioNameItem: Partial<FioNameItemProps>;
  }) => void;
  openDomainWatchlistModal: () => void;
};

export const WatchListDomainsComponent: React.FC<Props> = props => {
  const {
    domainWatchlistIsDeleting,
    domainsWatchlistList,
    domainWatchlistLoading,
    isDesktop,
    pageName,
    prices,
    selectedFioNameItem,
    selectedDomainWatchlistSettingsItem,
    showAddDomainWatchlistModal,
    showDangerModal,
    showItemModal,
    showSettingsModal,
    closeDomainWatchlistModal,
    domainWatchlistItemCreate,
    handleRenewDomain,
    onDangerModalAction,
    onDangerModalClose,
    onDangerModalOpen,
    onItemModalClose,
    onItemModalOpen,
    onPurchaseButtonClick,
    onSettingsClose,
    onSettingsOpen,
    openDomainWatchlistModal,
  } = props;

  const listItemsDefaultProps = {
    fioNameList: domainsWatchlistList,
    isDesktop,
    isDomainWatchlist: true,
    pageName,
  };

  const onDangerModalActionClick = useCallback(() => {
    onDangerModalAction(
      selectedDomainWatchlistSettingsItem?.domainsWatchlistItemId,
    );
  }, [
    onDangerModalAction,
    selectedDomainWatchlistSettingsItem?.domainsWatchlistItemId,
  ]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <ListNameTitle title="Domain Watchlist" className={classes.title} />
          <div className={classes.actionButtons}>
            <Link to={ROUTES.UNWRAP_DOMAIN}>
              <ActionButton
                title="Unwrap"
                icon={<ReplayIcon />}
                largeScreenTitle="Unwrap Domain"
              />
            </Link>
            <ActionButton
              title="Add to Watchlist"
              icon={<AddCircleIcon />}
              largeScreenTitle="Add to Watchlist"
              onClick={openDomainWatchlistModal}
            />
          </div>
        </div>
        <ListItemsComponent
          listItems={
            isDesktop ? (
              <DesktopView
                {...listItemsDefaultProps}
                onSettingsOpen={onSettingsOpen}
                onRenewDomain={handleRenewDomain}
              />
            ) : (
              <MobileView
                {...listItemsDefaultProps}
                hideTableHeader
                onItemModalOpen={onItemModalOpen}
              />
            )
          }
        />
      </div>
      <AddDomainToWatchListModal
        domainsWatchlistList={domainsWatchlistList}
        loading={domainWatchlistLoading}
        showModal={showAddDomainWatchlistModal}
        onClose={closeDomainWatchlistModal}
        prices={prices}
        domainWatchlistItemCreate={domainWatchlistItemCreate}
        onPurchaseButtonClick={onPurchaseButtonClick}
      />
      <Modal
        show={showItemModal}
        onClose={onItemModalClose}
        hideCloseButton={false}
        closeButton
        isSimple
      >
        <DomainItemComponent
          fioNameItem={selectedFioNameItem}
          isDesktop={isDesktop}
          isDomainWatchlist
          onRenewDomain={handleRenewDomain}
          onSettingsOpen={onSettingsOpen}
        />
      </Modal>
      <Modal
        show={showSettingsModal}
        onClose={onSettingsClose}
        hideCloseButton={false}
        closeButton
        isSimple
        isWide={isDesktop}
        hasDefaultCloseColor
      >
        <DomainsWatchlistSettingsItem
          account={selectedDomainWatchlistSettingsItem?.account}
          name={selectedDomainWatchlistSettingsItem?.name}
          publicKey={selectedDomainWatchlistSettingsItem?.walletPublicKey}
          loading={domainWatchlistIsDeleting}
          onDomainDeleteAction={onDangerModalOpen}
        />
      </Modal>
      <DangerModal
        show={showDangerModal}
        onClose={onDangerModalClose}
        onActionButtonClick={onDangerModalActionClick}
        buttonText="Yes, remove domain"
        title="Are You Sure?"
        showCancel={true}
        cancelButtonText="Cancel"
        subtitle={`You are removing ${selectedDomainWatchlistSettingsItem?.name} domain from watchlist`}
      />
    </>
  );
};

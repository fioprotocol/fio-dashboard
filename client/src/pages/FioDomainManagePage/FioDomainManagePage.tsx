import React from 'react';

import { ManagePageContainer } from '../../components/ManagePageContainer';
import Title from '../WalletsPage/components/Title';
import { WatchListDomainsComponent } from './components/WatchListDomainsComponent';
import { ListNameTitle } from './components/ListNameTitle';

import { useContext } from './FioDomainManagePageContext';

import { PAGE_NAME } from '../../components/ManagePageContainer/constants';
import { BADGE_TYPES } from '../../components/Badge/Badge';

const FioDomainManagePage: React.FC = () => {
  const {
    domainWatchlistIsDeleting,
    domainsWatchlistList,
    domainWatchlistLoading,
    emptyStateContent,
    isDesktop,
    prices,
    selectedDomainWatchlistItem,
    selectedDomainWatchlistSettingsItem,
    showAddDomainWatchlistModal,
    showDangerModal,
    showDomainWatchlistItemModal,
    showDomainWatchlistSettingsModal,
    showWarningMessage,
    successMessage,
    warningContent,
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
    sessionBadgeClose,
  } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      listNameTitle={<ListNameTitle title="My Domains" />}
      pageName={PAGE_NAME.DOMAIN}
      showTopBadge={!!successMessage}
      showWarningMessage={showWarningMessage}
      title={<Title title="Manage My FIO Domain" />}
      topBadgeContent={{
        message: successMessage,
        title: 'Success',
        type: BADGE_TYPES.INFO,
      }}
      warningContent={warningContent}
      handleRenewDomain={handleRenewDomain}
      onTopBadgeClose={onBagdeClose}
      sessionBadgeClose={sessionBadgeClose}
    >
      <WatchListDomainsComponent
        domainsWatchlistList={domainsWatchlistList}
        domainWatchlistIsDeleting={domainWatchlistIsDeleting}
        domainWatchlistLoading={domainWatchlistLoading}
        isDesktop={isDesktop}
        pageName={PAGE_NAME.DOMAIN}
        prices={prices}
        selectedFioNameItem={selectedDomainWatchlistItem}
        selectedDomainWatchlistSettingsItem={
          selectedDomainWatchlistSettingsItem
        }
        showAddDomainWatchlistModal={showAddDomainWatchlistModal}
        showDangerModal={showDangerModal}
        showItemModal={showDomainWatchlistItemModal}
        showSettingsModal={showDomainWatchlistSettingsModal}
        warningContent={warningContent}
        closeDomainWatchlistModal={closeDomainWatchlistModal}
        domainWatchlistItemCreate={domainWatchlistItemCreate}
        handleRenewDomain={handleRenewDomain}
        onDangerModalAction={onDangerModalAction}
        onDangerModalClose={onDangerModalClose}
        onDangerModalOpen={onDangerModalOpen}
        onItemModalClose={onDomainWatchlistItemModalClose}
        onItemModalOpen={onDomainWatchlistItemModalOpen}
        onPurchaseButtonClick={onPurchaseButtonClick}
        onSettingsClose={onDomainWatchlistItemSettingsClose}
        onSettingsOpen={onDomainWatchlistItemSettingsOpen}
        openDomainWatchlistModal={openDomainWatchlistModal}
      />
    </ManagePageContainer>
  );
};

export default FioDomainManagePage;

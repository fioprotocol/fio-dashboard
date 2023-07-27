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
    domainsWatchlistList,
    domainWatchlistLoading,
    emptyStateContent,
    isDesktop,
    prices,
    selectedDomainWatchlistItem,
    showAddDomainWatchlistModal,
    showDomainWatchlistItemModal,
    successMessage,
    warningContent,
    closeDomainWatchlistModal,
    domainWatchlistItemCreate,
    handleRenewDomain,
    onBagdeClose,
    onDomainWatchlistItemModalClose,
    onDomainWatchlistItemModalOpen,
    onPurchaseButtonClick,
    onDomainWatchlistItemSettingsOpen,
    openDomainWatchlistModal,
  } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      listNameTitle={<ListNameTitle title="My Domains" />}
      pageName={PAGE_NAME.DOMAIN}
      showTopBadge={!!successMessage}
      title={<Title title="Manage My FIO Domain" />}
      topBadgeContent={{
        message: successMessage,
        title: 'Success',
        type: BADGE_TYPES.INFO,
      }}
      warningContent={warningContent}
      handleRenewDomain={handleRenewDomain}
      onTopBadgeClose={onBagdeClose}
    >
      <WatchListDomainsComponent
        domainsWatchlistList={domainsWatchlistList}
        domainWatchlistLoading={domainWatchlistLoading}
        isDesktop={isDesktop}
        pageName={PAGE_NAME.DOMAIN}
        prices={prices}
        selectedFioNameItem={selectedDomainWatchlistItem}
        showAddDomainWatchlistModal={showAddDomainWatchlistModal}
        showItemModal={showDomainWatchlistItemModal}
        warningContent={warningContent}
        closeDomainWatchlistModal={closeDomainWatchlistModal}
        domainWatchlistItemCreate={domainWatchlistItemCreate}
        handleRenewDomain={handleRenewDomain}
        onItemModalClose={onDomainWatchlistItemModalClose}
        onItemModalOpen={onDomainWatchlistItemModalOpen}
        onPurchaseButtonClick={onPurchaseButtonClick}
        onSettingsOpen={onDomainWatchlistItemSettingsOpen}
        openDomainWatchlistModal={openDomainWatchlistModal}
      />
    </ManagePageContainer>
  );
};

export default FioDomainManagePage;

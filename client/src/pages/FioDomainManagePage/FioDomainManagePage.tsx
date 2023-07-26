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
    prices,
    showAddDomainWatchlistModal,
    successMessage,
    warningContent,
    closeDomainWatchlistModal,
    domainWatchlistItemCreate,
    handleRenewDomain,
    onBagdeClose,
    onPurchaseButtonClick,
    openDomainWatchlistModal,
  } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      pageName={PAGE_NAME.DOMAIN}
      title={<Title title="Manage My FIO Domain" />}
      warningContent={warningContent}
      handleRenewDomain={handleRenewDomain}
      listNameTitle={<ListNameTitle title="My Domains" />}
      showTopBadge={!!successMessage}
      topBadgeContent={{
        message: successMessage,
        title: 'Success',
        type: BADGE_TYPES.INFO,
      }}
      onTopBadgeClose={onBagdeClose}
    >
      <WatchListDomainsComponent
        domainsWatchlistList={domainsWatchlistList}
        closeDomainWatchlistModal={closeDomainWatchlistModal}
        domainWatchlistLoading={domainWatchlistLoading}
        prices={prices}
        showAddDomainWatchlistModal={showAddDomainWatchlistModal}
        domainWatchlistItemCreate={domainWatchlistItemCreate}
        onPurchaseButtonClick={onPurchaseButtonClick}
        openDomainWatchlistModal={openDomainWatchlistModal}
      />
    </ManagePageContainer>
  );
};

export default FioDomainManagePage;

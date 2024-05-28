import React from 'react';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { ActionButton } from '../../components/common/ActionButton';
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
    successMessage,
    warningContent,
    closeDomainWatchlistModal,
    domainWatchlistItemCreate,
    handleRenewDomain,
    handleRenewWatchedDomain,
    onBagdeClose,
    onDangerModalAction,
    onDangerModalClose,
    onDangerModalOpen,
    onDomainWatchlistItemModalClose,
    onDomainWatchlistItemModalOpen,
    onPurchaseButtonClick,
    onDomainWatchlistItemSettingsClose,
    onDomainWatchlistItemSettingsOpen,
    onBuyDomainAction,
    openDomainWatchlistModal,
  } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      listNameTitle={
        <ListNameTitle
          title="My Domains"
          action={
            <ActionButton
              icon={<AddShoppingCartIcon />}
              title="Buy"
              largeScreenTitle="Buy Domain"
              onClick={onBuyDomainAction}
            />
          }
        />
      }
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
        closeDomainWatchlistModal={closeDomainWatchlistModal}
        domainWatchlistItemCreate={domainWatchlistItemCreate}
        handleRenewDomain={handleRenewWatchedDomain}
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

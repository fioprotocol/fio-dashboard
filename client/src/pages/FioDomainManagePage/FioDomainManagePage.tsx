import React from 'react';

import { ManagePageContainer } from '../../components/ManagePageContainer';
import Title from '../WalletsPage/components/Title';
import { WatchListDomainsComponent } from './components/WatchListDomainsComponent';
import { ListNameTitle } from './components/ListNameTitle';

import { useContext } from './FioDomainManagePageContext';

import { PAGE_NAME } from '../../components/ManagePageContainer/constants';

const FioDomainManagePage: React.FC = () => {
  const {
    emptyStateContent,
    prices,
    warningContent,
    handleRenewDomain,
    onPurchaseButtonClick,
  } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      pageName={PAGE_NAME.DOMAIN}
      title={<Title title="Manage My FIO Domain" />}
      warningContent={warningContent}
      handleRenewDomain={handleRenewDomain}
      listNameTitle={<ListNameTitle title="My Domains" />}
    >
      <WatchListDomainsComponent
        prices={prices}
        onPurchaseButtonClick={onPurchaseButtonClick}
      />
    </ManagePageContainer>
  );
};

export default FioDomainManagePage;

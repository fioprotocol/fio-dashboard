import React from 'react';

import { ManagePageContainer } from '../../components/ManagePageContainer/ManagePageContainer';

import { TitleComponent } from './components/Title/TitleComponent';
import { WatchListDomainsComponent } from './components/WatchListDomainsComponent';
import { ListNameTitle } from './components/ListNameTitle';

import { useContext } from './FioDomainManagePageContext';

import { PAGE_NAME } from '../../components/ManagePageContainer/constants';

const FioDomainManagePage: React.FC = () => {
  const { emptyStateContent, warningContent, handleRenewDomain } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      pageName={PAGE_NAME.DOMAIN}
      title={<TitleComponent />}
      warningContent={warningContent}
      handleRenewDomain={handleRenewDomain}
      listNameTitle={<ListNameTitle title="My Domains" />}
    >
      <WatchListDomainsComponent />
    </ManagePageContainer>
  );
};

export default FioDomainManagePage;

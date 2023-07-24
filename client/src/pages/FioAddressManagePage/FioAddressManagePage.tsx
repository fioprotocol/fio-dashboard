import React from 'react';

import { ManagePageContainer } from '../../components/ManagePageContainer/ManagePageContainer';
import Title from '../WalletsPage/components/Title';

import { PAGE_NAME } from '../../components/ManagePageContainer/constants';

import { useContext } from './FioAddressManagePageContext';

const FioAddressManagePage: React.FC = () => {
  const { emptyStateContent, warningContent, handleAddBundles } = useContext();
  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      pageName={PAGE_NAME.ADDRESS}
      title={
        <Title
          title="Manage My FIO Crypto Handles"
          subtitle="FIO Crypto Handles owned by all your wallets."
        />
      }
      warningContent={warningContent}
      handleAddBundles={handleAddBundles}
    />
  );
};

export default FioAddressManagePage;

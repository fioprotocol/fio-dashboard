import React from 'react';

import { ManagePageContainer } from '../../components/ManagePageContainer/ManagePageContainer';
import Title from '../WalletsPage/components/Title';

import { PAGE_NAME } from '../../components/ManagePageContainer/constants';

import { useContext } from './FioAddressManagePageContext';

const FioAddressManagePage: React.FC = () => {
  const {
    emptyStateContent,
    showWarningMessage,
    warningContent,
    handleAddBundles,
    sessionBadgeClose,
  } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      pageName={PAGE_NAME.ADDRESS}
      showWarningMessage={showWarningMessage}
      title={
        <Title
          title="Manage My FIO Crypto Handles"
          subtitle="FIO Crypto Handles owned by all your wallets."
        />
      }
      warningContent={warningContent}
      handleAddBundles={handleAddBundles}
      sessionBadgeClose={sessionBadgeClose}
    />
  );
};

export default FioAddressManagePage;

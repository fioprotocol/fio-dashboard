import React from 'react';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { ManagePageContainer } from '../../components/ManagePageContainer';
import { ActionButton } from '../../components/common/ActionButton';
import { PAGE_NAME } from '../../components/ManagePageContainer/constants';

import Title from '../WalletsPage/components/Title';
import { ListNameTitle } from '../FioDomainManagePage/components/ListNameTitle';

import { useContext } from './FioAddressManagePageContext';

const FioAddressManagePage: React.FC = () => {
  const {
    emptyStateContent,
    warningContent,
    handleAddBundles,
    onBuyFioHandleAction,
  } = useContext();

  return (
    <ManagePageContainer
      emptyStateContent={emptyStateContent}
      pageName={PAGE_NAME.ADDRESS}
      title={
        <Title
          title="Manage My FIO Handles"
          subtitle="FIO Handles owned by all your wallets."
        />
      }
      listNameTitle={
        <ListNameTitle
          title="My FIO Handles"
          action={
            <ActionButton
              icon={<AddShoppingCartIcon />}
              title="Buy"
              largeScreenTitle="Buy FIO Handle"
              onClick={onBuyFioHandleAction}
            />
          }
        />
      }
      warningContent={warningContent}
      handleAddBundles={handleAddBundles}
    />
  );
};

export default FioAddressManagePage;

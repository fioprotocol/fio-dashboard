import React from 'react';

import ManagePageContainer from '../../components/ManagePageContainer/ManagePageContainer';

import { ADDRESS } from '../../constants/common';

import { ContainerProps } from '../../components/ManagePageContainer/types';

const FioAddressManagePage: React.FC<ContainerProps> = props => (
  <ManagePageContainer
    {...props}
    pageName={ADDRESS}
    showBundles={true}
    showFioAddressName={true}
  />
);

export default FioAddressManagePage;

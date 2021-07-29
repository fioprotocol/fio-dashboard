import React from 'react';
import ManagePageContainer from '../../components/ManagePageContainer/ManagePageContainer';
import { ContainerProps } from '../../components/ManagePageContainer/types';
import { DOMAIN } from '../../constants/common';

const FioDomainManagePage: React.FC<ContainerProps> = props => (
  <ManagePageContainer pageName={DOMAIN} {...props} />
);

export default FioDomainManagePage;

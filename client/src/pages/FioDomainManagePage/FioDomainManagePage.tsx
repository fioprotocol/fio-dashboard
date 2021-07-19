import React from 'react';
import ManagePageContainer from '../../components/ManagePageContainer/ManagePageContainer';
import { ContainerProps } from '../../components/ManagePageContainer/types';

const FioDomainManagePage: React.FC<ContainerProps> = props => (
  <ManagePageContainer pageName="domain" {...props} />
);

export default FioDomainManagePage;

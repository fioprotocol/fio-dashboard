import React from 'react';
import ManagePageContainer from '../../components/ManagePageContainer/ManagePageContainer';
import { ContainerProps } from '../../components/ManagePageContainer/types';

const FioAddressManagePage: React.FC<ContainerProps> = props => (
  <ManagePageContainer pageName="address" {...props} />
);

export default FioAddressManagePage;

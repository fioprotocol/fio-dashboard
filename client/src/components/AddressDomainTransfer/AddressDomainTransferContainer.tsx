import React from 'react';
import { ContainerProps } from './types';

export const AddressDomainTransferContainer: React.FC<ContainerProps> = props => {
  const { pageName } = props;
  return <div>{pageName}</div>;
};

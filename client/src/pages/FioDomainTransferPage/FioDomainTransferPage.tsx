import React from 'react';
import AddressDomainTransferContainer from '../../components/AddressDomainTransfer';

import { RouteComponentProps } from 'react-router-dom';

import { AddressDomainItemProps } from '../../types';

interface MatchParams {
  id: string;
}
interface Props extends RouteComponentProps<MatchParams> {
  data: AddressDomainItemProps[];
}

export const FioDomainTransferPage: React.FC<Props> = props => {
  const { data, match } = props;
  const { id: name } = match.params;

  return (
    <AddressDomainTransferContainer pageName="domain" data={data} name={name} />
  );
};

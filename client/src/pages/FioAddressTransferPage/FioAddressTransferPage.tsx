import React from 'react';
import AddressDomainTransferContainer from '../../components/AddressDomainTransfer';

import { RouteComponentProps } from 'react-router-dom';

import { FioNameItemProps } from '../../types';

interface MatchParams {
  id: string;
}
interface Props extends RouteComponentProps<MatchParams> {
  fioNameList: FioNameItemProps[];
}

export const FioAddressTransferPage: React.FC<Props> = props => {
  const { fioNameList, match } = props;
  const { id: name } = match.params;

  return (
    <AddressDomainTransferContainer
      pageName="address"
      fioNameList={fioNameList}
      name={name}
    />
  );
};

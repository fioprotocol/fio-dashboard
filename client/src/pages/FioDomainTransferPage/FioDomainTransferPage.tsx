import React from 'react';
import AddressDomainTransferContainer from '../../components/AddressDomainTransfer';

import { RouteComponentProps } from 'react-router-dom';

import { FioNameItemProps } from '../../types';
import { DOMAIN } from '../../constants/common';

interface MatchParams {
  id: string;
}
type Props = {
  fioNameList: FioNameItemProps[];
};

export const FioDomainTransferPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList, match } = props;
  const { id: name } = match.params;

  return (
    <AddressDomainTransferContainer
      pageName={DOMAIN}
      fioNameList={fioNameList}
      name={name}
    />
  );
};

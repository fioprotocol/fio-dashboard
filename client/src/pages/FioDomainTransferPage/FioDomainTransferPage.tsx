import React from 'react';

import { RouteComponentProps } from 'react-router-dom';

import FioNameTransferContainer from '../../components/FioNameTransfer';

import { FioNameItemProps } from '../../types';
import { DOMAIN } from '../../constants/common';

type MatchParams = {
  id: string;
};

type Props = {
  fioNameList: FioNameItemProps[];
};

export const FioDomainTransferPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList, match, history } = props;
  const { id: name } = match.params;

  return (
    <FioNameTransferContainer
      fioNameType={DOMAIN}
      fioNameList={fioNameList}
      name={name}
      history={history}
    />
  );
};

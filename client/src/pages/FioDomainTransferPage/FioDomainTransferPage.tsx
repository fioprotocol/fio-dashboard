import React from 'react';

import { RouteComponentProps } from 'react-router-dom';

import FioNameTransferContainer from '../../components/FioNameTransfer';

import { DOMAIN } from '../../constants/common';
import { DEFAULT_FEE_PRICES } from '../../util/prices';

import apis from '../../api';

import { FeePrice, FioNameItemProps } from '../../types';

type MatchParams = {
  id: string;
};

type Props = {
  fioNameList: FioNameItemProps[];
  fees: { [endpoint: string]: FeePrice };
};

export const FioDomainTransferPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList, fees, match, history } = props;
  const { id: name } = match.params;

  return (
    <FioNameTransferContainer
      fioNameType={DOMAIN}
      fioNameList={fioNameList}
      name={name}
      feePrice={
        fees[apis.fio.actionEndPoints.transferFioDomain] || DEFAULT_FEE_PRICES
      }
      history={history}
    />
  );
};

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import FioNamesInitWrapper from '../../components/FioNamesInitWrapper';
import FioNameRenewContainer from '../../components/FioNameRenew';

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

const FioDomainRenewPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList, match, history, fees } = props;
  const { id: name } = match.params;

  return (
    <FioNamesInitWrapper>
      <FioNameRenewContainer
        fioNameType={DOMAIN}
        fioNameList={fioNameList}
        name={name}
        feePrice={
          fees[apis.fio.actionEndPoints.renewFioDomain] || DEFAULT_FEE_PRICES
        }
        history={history}
      />
    </FioNamesInitWrapper>
  );
};

export default FioDomainRenewPage;

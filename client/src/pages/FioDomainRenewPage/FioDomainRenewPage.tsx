import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import FioNamesInitWrapper from '../../components/FioNamesInitWrapper';
import FioNameRenewContainer from '../../components/FioNameRenew';

import { DOMAIN } from '../../constants/common';

import { FioNameItemProps } from '../../types';

type MatchParams = {
  id: string;
};

type Props = {
  fioNameList: FioNameItemProps[];
};

const FioDomainRenewPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList, match, history } = props;
  const { id: name } = match.params;

  return (
    <FioNamesInitWrapper>
      <FioNameRenewContainer
        fioNameType={DOMAIN}
        fioNameList={fioNameList}
        name={name}
        history={history}
      />
    </FioNamesInitWrapper>
  );
};

export default FioDomainRenewPage;

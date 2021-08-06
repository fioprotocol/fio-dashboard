import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import FioNameRenewContainer from '../../components/FioNameRenew';
import { FioNameItemProps } from '../../types';
import { DOMAIN } from '../../constants/common';

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
    <FioNameRenewContainer
      pageName={DOMAIN}
      fioNameList={fioNameList}
      name={name}
      history={history}
    />
  );
};

export default FioDomainRenewPage;

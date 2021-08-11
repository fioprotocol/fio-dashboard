import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FioNameItemProps } from '../../types';
import FioDomainStatusChangeContainer from '../../components/FioDomainStatusChange';

type MatchParams = {
  id: string;
};

type Props = {
  fioNameList: FioNameItemProps[];
};
const FioDomainStatusChangePage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList, match, history } = props;
  const { id: name } = match.params;

  return (
    <FioDomainStatusChangeContainer
      fioNameList={fioNameList}
      history={history}
      name={name}
    />
  );
};

export default FioDomainStatusChangePage;

import React from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';

import FioNamesInitWrapper from '../../components/FioNamesInitWrapper';
import WrapDomainContainer from './components/WrapDomainContainer';

import { MatchParams, Props } from './types';

const WrapDomainPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { fioNameList } = props;
  const { id }: { id: string } = useParams();

  return (
    <FioNamesInitWrapper>
      <WrapDomainContainer fioNameList={fioNameList} name={id} />
    </FioNamesInitWrapper>
  );
};

export default WrapDomainPage;

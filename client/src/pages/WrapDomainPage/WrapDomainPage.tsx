import React from 'react';

import FioNamesInitWrapper from '../../components/FioNamesInitWrapper';
import WrapDomainContainer from './components/WrapDomainContainer';

import { LocationProps, Props } from './types';

const WrapDomainPage: React.FC<Props & LocationProps> = props => {
  const {
    fioNameList,
    location: { query: { name } = {} },
  } = props;

  return (
    <FioNamesInitWrapper>
      <WrapDomainContainer fioNameList={fioNameList} name={name} />
    </FioNamesInitWrapper>
  );
};

export default WrapDomainPage;

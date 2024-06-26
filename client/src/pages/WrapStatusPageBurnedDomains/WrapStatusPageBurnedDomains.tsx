import React from 'react';

import WrapStatus from '../../components/WrapStatusPages/WrapStatusPage/WrapStatus';

import { PageProps } from './types';

const WrapStatusPageBurnedDomains: React.FC<PageProps> = props => {
  return (
    <>
      <WrapStatus isWrap={false} isTokens={false} isBurned {...props} />
    </>
  );
};

export default WrapStatusPageBurnedDomains;

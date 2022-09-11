import React from 'react';

import WrapStatus from '../../components/WrapStatusPages/WrapStatusPage/WrapStatus';

import { PageProps } from './types';

const WrapStatusPageUnwrapDomains: React.FC<PageProps> = props => {
  return (
    <>
      <WrapStatus isWrap={false} isTokens={false} {...props} />
    </>
  );
};

export default WrapStatusPageUnwrapDomains;

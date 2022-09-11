import React from 'react';

import WrapStatus from '../../components/WrapStatusPages/WrapStatusPage/WrapStatus';

import { PageProps } from './types';

const WrapStatusPageWrapDomains: React.FC<PageProps> = props => {
  return (
    <>
      <WrapStatus isWrap={true} isTokens={false} {...props} />
    </>
  );
};

export default WrapStatusPageWrapDomains;

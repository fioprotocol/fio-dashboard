import React from 'react';

import WrapStatus from '../../components/WrapStatusPages/WrapStatusPage/WrapStatus';

import { PageProps } from './types';

const WrapStatusPageWrapTokens: React.FC<PageProps> = props => {
  return (
    <>
      <WrapStatus isWrap={true} isTokens={true} {...props} />
    </>
  );
};

export default WrapStatusPageWrapTokens;

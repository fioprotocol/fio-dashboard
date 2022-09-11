import React from 'react';

import WrapStatus from '../../components/WrapStatusPages/WrapStatusPage/WrapStatus';

import { PageProps } from './types';

const WrapStatusPageUnwrapTokens: React.FC<PageProps> = props => {
  return (
    <>
      <WrapStatus isWrap={false} isTokens={true} {...props} />
    </>
  );
};

export default WrapStatusPageUnwrapTokens;

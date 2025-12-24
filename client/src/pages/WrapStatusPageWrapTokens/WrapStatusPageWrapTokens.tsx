import React from 'react';

import WrapStatus from '../../components/WrapStatusPages/WrapStatusPage/WrapStatus';

import {
  OPERATION_TYPES,
  ASSET_TYPES,
  WRAP_STATUS_CHAIN_CODES,
} from '../../components/WrapStatusPages/WrapStatusPage/constants';

import { PageProps } from './types';

const WrapStatusPageWrapTokens: React.FC<PageProps> = props => {
  return (
    <WrapStatus
      operationType={OPERATION_TYPES.WRAP}
      assetType={ASSET_TYPES.TOKENS}
      chainCode={WRAP_STATUS_CHAIN_CODES.ETH}
      {...props}
    />
  );
};

export default WrapStatusPageWrapTokens;

import React from 'react';

import WrapStatus from '../../components/WrapStatusPages/WrapStatusPage/WrapStatus';

import {
  OPERATION_TYPES,
  ASSET_TYPES,
  WRAP_STATUS_CHAIN_CODES,
} from '../../components/WrapStatusPages/WrapStatusPage/constants';

import { PageProps } from './types';

const WrapStatusPageBurnedDomains: React.FC<PageProps> = props => {
  return (
    <WrapStatus
      operationType={OPERATION_TYPES.BURNED}
      assetType={ASSET_TYPES.DOMAINS}
      chainCode={WRAP_STATUS_CHAIN_CODES.POL}
      {...props}
    />
  );
};

export default WrapStatusPageBurnedDomains;

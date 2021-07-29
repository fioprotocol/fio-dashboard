import React from 'react';
import { DOMAIN } from '../../constants/common';
import FioNameTransferSuccess from '../../components/FioNameTransfer/FioNameTransferSuccess';
import { FioTransferSuccessProps } from '../../components/FioNameTransfer/FioNameTransferSuccess/types';

const FioDomainTransferSuccessPage: React.FC<FioTransferSuccessProps> = props => {
  return <FioNameTransferSuccess pageName={DOMAIN} {...props} />;
};

export default FioDomainTransferSuccessPage;

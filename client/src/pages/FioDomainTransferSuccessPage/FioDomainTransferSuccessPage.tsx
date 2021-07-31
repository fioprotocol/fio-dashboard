import React from 'react';
import { DOMAIN } from '../../constants/common';
import FioNameTransferSuccess from '../../components/FioNameTransfer/FioNameTransferSuccess';
import { FioTransferResultsProps } from '../../components/FioNameTransfer/FioNameTransferSuccess/types';

const FioDomainTransferSuccessPage: React.FC<FioTransferResultsProps> = props => {
  return <FioNameTransferSuccess pageName={DOMAIN} {...props} />;
};

export default FioDomainTransferSuccessPage;

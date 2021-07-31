import React from 'react';
import { DOMAIN } from '../../constants/common';
import FioNameTransferResults from '../../components/FioNameTransfer/FioNameTransferResults';
import { FioTransferSuccessProps } from '../../components/FioNameTransfer/FioNameTransferResults/types';

const FioDomainTransferResultsPage: React.FC<FioTransferSuccessProps> = props => {
  return <FioNameTransferResults pageName={DOMAIN} {...props} />;
};

export default FioDomainTransferResultsPage;

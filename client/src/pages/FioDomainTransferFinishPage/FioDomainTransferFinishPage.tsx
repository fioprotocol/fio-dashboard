import React from 'react';
import { DOMAIN } from '../../constants/common';
import FioNameTransferFinish from '../../components/FioNameTransfer/FioNameTransferFinish';
import { FioTransferFinishProps } from '../../components/FioNameTransfer/FioNameTransferFinish/types';

const FioDomainTransferFinishPage: React.FC<FioTransferFinishProps> = props => {
  return <FioNameTransferFinish pageName={DOMAIN} {...props} />;
};

export default FioDomainTransferFinishPage;

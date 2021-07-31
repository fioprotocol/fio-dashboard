import React from 'react';
import { ADDRESS } from '../../constants/common';
import FioNameTransferResults from '../../components/FioNameTransfer/FioNameTransferResults';
import { FioTransferSuccessProps } from '../../components/FioNameTransfer/FioNameTransferResults/types';

const FioAddressTransferResultsPage: React.FC<FioTransferSuccessProps> = props => {
  return <FioNameTransferResults pageName={ADDRESS} {...props} />;
};

export default FioAddressTransferResultsPage;

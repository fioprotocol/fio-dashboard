import React from 'react';
import { ADDRESS } from '../../constants/common';
import FioNameTransferResults from '../../components/FioNameTransfer/FioNameTransferResults';
import { FioTransferResultsProps } from '../../components/FioNameTransfer/FioNameTransferResults/types';

const FioAddressTransferResultsPage: React.FC<FioTransferResultsProps> = props => {
  return <FioNameTransferResults pageName={ADDRESS} {...props} />;
};

export default FioAddressTransferResultsPage;

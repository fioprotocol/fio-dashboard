import React from 'react';
import { ADDRESS } from '../../constants/common';
import FioNameTransferSuccess from '../../components/FioNameTransfer/FioNameTransferSuccess';
import { FioTransferResultsProps } from '../../components/FioNameTransfer/FioNameTransferSuccess/types';

const FioAddressTransferSuccessPage: React.FC<FioTransferResultsProps> = props => {
  return <FioNameTransferSuccess pageName={ADDRESS} {...props} />;
};

export default FioAddressTransferSuccessPage;

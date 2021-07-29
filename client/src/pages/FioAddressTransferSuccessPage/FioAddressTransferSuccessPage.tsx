import React from 'react';
import { ADDRESS } from '../../constants/common';
import FioNameTransferSuccess from '../../components/FioNameTransfer/FioNameTransferSuccess';
import { FioTransferSuccessProps } from '../../components/FioNameTransfer/FioNameTransferSuccess/types';

const FioAddressTransferSuccessPage: React.FC<FioTransferSuccessProps> = props => {
  return <FioNameTransferSuccess pageName={ADDRESS} {...props} />;
};

export default FioAddressTransferSuccessPage;

import React from 'react';
import { ADDRESS } from '../../constants/common';
import FioNameTransferFinish from '../../components/FioNameTransfer/FioNameTransferFinish';
import { FioTransferFinishProps } from '../../components/FioNameTransfer/FioNameTransferFinish/types';

const FioAddressTransferFinishPage: React.FC<FioTransferFinishProps> = props => {
  return <FioNameTransferFinish pageName={ADDRESS} {...props} />;
};

export default FioAddressTransferFinishPage;

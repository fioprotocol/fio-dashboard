import React from 'react';

import BeforeSubmitEdgeWallet from './BeforeSubmitEdgeWallet';

import { WALLET_CREATED_FROM } from '../../../constants/common';

import { BeforeSubmitProps } from '../types';

const BeforeSubmitWalletConfirm: React.FC<BeforeSubmitProps> = props => {
  const { walletConfirmType } = props;

  return (
    <>
      {walletConfirmType === WALLET_CREATED_FROM.EDGE ? (
        <BeforeSubmitEdgeWallet {...props} />
      ) : null}
    </>
  );
};

export default BeforeSubmitWalletConfirm;

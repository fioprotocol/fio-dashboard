import React from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import { FioTokensReceive } from '../../components/FioTokensReceive';

import { ContainerProps, LocationProps } from './types';

const FioTokensReceivePage: React.FC<ContainerProps &
  LocationProps> = props => {
  const {
    fioWallet,
    history,
    fioCryptoHandles,
    location: { query: { publicKey: publicKeyFromPath } = {} },
  } = props;

  const isValidPublicKeyFromPath =
    publicKeyFromPath != null && publicKeyFromPath !== '';

  const onBack = () => {
    history.goBack();
  };

  if (isValidPublicKeyFromPath && (!fioWallet || !fioWallet.id)) {
    return <FioLoader wrap={true} />;
  }

  return (
    <FioTokensReceive
      fioWallet={fioWallet}
      fioCryptoHandles={fioCryptoHandles}
      title="Receive FIO Tokens"
      onBack={onBack}
    />
  );
};

export default FioTokensReceivePage;

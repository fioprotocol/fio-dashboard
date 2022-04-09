import React, { useEffect, useState } from 'react';

import CreateWalletModal from '../CreateWalletModal';
import CreateEdgeWallet from './CreateEdgeWallet';

import {
  WALLET_CREATED_FROM,
  DEFAULT_WALLET_OPTIONS,
} from '../../../../constants/common';

import { CreateWalletValues } from '../../types';
import { FioWalletDoublet, NewFioWalletDoublet } from '../../../../types';

type Props = {
  show: boolean;
  genericErrorModalIsActive: boolean;
  addWalletLoading: boolean;
  pinModalIsOpen: boolean;
  fioWallets: FioWalletDoublet[];
  onClose: () => void;
  onWalletCreated: () => void;
  addWallet: (data: NewFioWalletDoublet) => void;
};

const CreateWallet: React.FC<Props> = props => {
  const {
    show,
    genericErrorModalIsActive,
    addWalletLoading,
    pinModalIsOpen,
    onClose,
    addWallet,
    fioWallets,
    onWalletCreated,
  } = props;

  const edgeWalletsAmount = fioWallets.filter(
    ({ from }) => from === WALLET_CREATED_FROM.EDGE,
  ).length;

  const [creationType, setCreationType] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentValues, setCurrentValues] = useState<CreateWalletValues>({
    name: '',
    ledger: false,
  });

  useEffect(() => {
    if (show) {
      const newWalletCount = edgeWalletsAmount + 1;
      const defaultName = `${DEFAULT_WALLET_OPTIONS.name} ${newWalletCount}`;

      setCurrentValues({
        name: defaultName,
        ledger: false,
      });
    }
  }, [show, edgeWalletsAmount]);

  useEffect(() => {
    if (processing && !addWalletLoading) {
      onWalletCreated();
      setProcessing(false);
    }
  }, [addWalletLoading, processing, onWalletCreated]);

  const onCreateSubmit = (values: CreateWalletValues) => {
    setCurrentValues(values);
    setCreationType(
      values.ledger ? WALLET_CREATED_FROM.LEDGER : WALLET_CREATED_FROM.EDGE,
    );
  };

  const onWalletDataPrepared = (walletData: NewFioWalletDoublet) => {
    addWallet(walletData);
    setCreationType(null);
  };

  const onOptionCancel = () => {
    setCreationType(null);
    setProcessing(false);
  };

  const onModalClose = () => {
    if (!processing && !addWalletLoading) {
      onClose();
    }
  };

  return (
    <>
      {creationType === WALLET_CREATED_FROM.EDGE ? (
        <CreateEdgeWallet
          setProcessing={setProcessing}
          processing={processing}
          values={currentValues}
          onWalletDataPrepared={onWalletDataPrepared}
          onOptionCancel={onOptionCancel}
          {...props}
        />
      ) : null}
      <CreateWalletModal
        show={show && !pinModalIsOpen && !genericErrorModalIsActive}
        onClose={onModalClose}
        loading={processing || addWalletLoading}
        onSubmit={onCreateSubmit}
        initialValues={currentValues}
      />
    </>
  );
};

export default CreateWallet;

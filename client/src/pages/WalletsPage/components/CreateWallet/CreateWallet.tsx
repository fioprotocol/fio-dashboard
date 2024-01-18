import React, { useEffect, useState } from 'react';

import CreateWalletModal from '../CreateWalletModal';
import CreateEdgeWallet from './CreateEdgeWallet';
import CreateLedgerWallet from './CreateLedgerWallet';
import { CreateMetamaskWallet } from './CreateMetamaskWallet';

import {
  WALLET_CREATED_FROM,
  DEFAULT_WALLET_OPTIONS,
} from '../../../../constants/common';
import { USER_PROFILE_TYPE } from '../../../../constants/profile';

import { CreateWalletValues } from '../../types';
import { FioWalletDoublet, NewFioWalletDoublet, User } from '../../../../types';

type Props = {
  show: boolean;
  genericErrorModalIsActive: boolean;
  addWalletLoading: boolean;
  pinModalIsOpen: boolean;
  fioWallets: FioWalletDoublet[];
  user: User;
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
    user,
    onClose,
    addWallet,
    fioWallets,
    onWalletCreated,
  } = props;

  const walletsAmount = fioWallets.length;
  const existingWalletNames = fioWallets.map(fioWallet => fioWallet.name);
  const existingWalletNamesJSON = JSON.stringify(existingWalletNames);

  const [creationType, setCreationType] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentValues, setCurrentValues] = useState<CreateWalletValues>({
    name: '',
    ledger: false,
  });

  const isMetamaskWalletProvider =
    window.ethereum?.isMetaMask &&
    user.userProfileType === USER_PROFILE_TYPE.ALTERNATIVE;

  useEffect(() => {
    if (show) {
      const parsedExistingWalletNames = JSON.parse(existingWalletNamesJSON);

      const generateUniqueDefaultName = (existingNames: string[]) => {
        const walletsAmount = existingNames.length;
        let newWalletCount = walletsAmount + 1;
        let defaultName = `${DEFAULT_WALLET_OPTIONS.name} ${newWalletCount}`;

        while (existingNames.includes(defaultName)) {
          newWalletCount++;
          defaultName = `${DEFAULT_WALLET_OPTIONS.name} ${newWalletCount}`;
        }

        return defaultName;
      };

      const newDefaultName = generateUniqueDefaultName(
        parsedExistingWalletNames,
      );

      setCurrentValues({
        name: newDefaultName,
        ledger: false,
      });
    }
  }, [
    creationType,
    existingWalletNamesJSON,
    isMetamaskWalletProvider,
    show,
    walletsAmount,
  ]);

  useEffect(() => {
    if (processing && !addWalletLoading) {
      onWalletCreated();
      setProcessing(false);
    }
  }, [addWalletLoading, processing, onWalletCreated]);

  const onCreateSubmit = (values: CreateWalletValues) => {
    setCurrentValues(values);
    setCreationType(
      values.ledger
        ? WALLET_CREATED_FROM.LEDGER
        : isMetamaskWalletProvider
        ? WALLET_CREATED_FROM.METAMASK
        : WALLET_CREATED_FROM.EDGE,
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
      {creationType === WALLET_CREATED_FROM.LEDGER ? (
        <CreateLedgerWallet
          setProcessing={setProcessing}
          values={currentValues}
          onWalletDataPrepared={onWalletDataPrepared}
          onOptionCancel={onOptionCancel}
          {...props}
        />
      ) : null}
      {creationType === WALLET_CREATED_FROM.METAMASK ? (
        <CreateMetamaskWallet
          setProcessing={setProcessing}
          values={currentValues}
          onWalletDataPrepared={onWalletDataPrepared}
          {...props}
        />
      ) : null}
      <CreateWalletModal
        show={
          show &&
          !pinModalIsOpen &&
          !genericErrorModalIsActive &&
          creationType !== WALLET_CREATED_FROM.LEDGER
        }
        onClose={onModalClose}
        loading={processing || addWalletLoading}
        onSubmit={onCreateSubmit}
        initialValues={currentValues}
      />
    </>
  );
};

export default CreateWallet;

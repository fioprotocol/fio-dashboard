import React, { useState, useEffect } from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import ImportWalletForm from './components/ImportWalletForm';
import CancelConfirmModal from './components/CancelConfirmModal';
import CancelButton from '../../components/common/CancelButton/CancelButton';

import {
  CONFIRM_PIN_ACTIONS,
  DEFAULT_WALLET_OPTIONS,
  FIO_WALLET_TYPE,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { SubmitActionParams } from '../../components/EdgeConfirmAction/types';
import { ContainerProps, ImportWalletValues } from './types';
import { NewFioWalletDoublet } from '../../types';

import { validate } from './validation';

import classes from './ImportWalletPage.module.scss';

const ImportWalletPage: React.FC<ContainerProps> = props => {
  const {
    addWalletLoading,
    fioWallets,
    history,
    addWallet,
    showGenericErrorModal,
  } = props;

  const [processing, setProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [currentValues, setCurrentValues] = useState<ImportWalletValues | null>(
    null,
  );
  const [importedPublicKey, setPublicKey] = useState<string | null>(null);

  // redirect after successful import
  useEffect(() => {
    if (importedPublicKey && fioWallets.length && !addWalletLoading) {
      const importedWallet = fioWallets.find(
        ({ publicKey }) => publicKey === importedPublicKey,
      );
      if (importedWallet != null && importedWallet.id)
        history.push(`${ROUTES.TOKENS}?imported=${importedPublicKey}`);
    }
  }, [fioWallets, addWalletLoading, importedPublicKey]);

  const importWallet = async ({ edgeAccount, data }: SubmitActionParams) => {
    const { privateSeed, name } = data;

    const newWallet = await edgeAccount.createCurrencyWallet(FIO_WALLET_TYPE, {
      ...DEFAULT_WALLET_OPTIONS,
      name,
      importText: privateSeed,
    });

    return {
      edgeId: newWallet?.id,
      name,
      publicKey: newWallet?.publicWalletInfo.keys.publicKey,
      from: WALLET_CREATED_FROM.EDGE,
    };
  };

  const onSubmit = async (values: ImportWalletValues) => {
    const errors = await validate(values);

    if (errors != null) {
      showGenericErrorModal(
        errors.message,
        'Something Went Wrong',
        errors.tryAgain ? 'Try Again' : 'Close',
      );

      return {
        privateSeed: errors.message,
      };
    }

    setPublicKey(null);
    setCurrentValues(values);

    return {};
  };
  const onSuccess = (walletData: NewFioWalletDoublet) => {
    setCurrentValues(null);
    setProcessing(false);
    setPublicKey(walletData.publicKey);
    addWallet(walletData);
  };
  const onPinCancel = () => {
    setCurrentValues(null);
    setProcessing(false);
  };
  const onCancel = () => {
    if (!addWalletLoading && !processing) setShowCancelConfirm(true);
  };
  const onConfirmCancel = () => {
    history.push(ROUTES.TOKENS);
  };
  const onCancelConfirmClose = () => {
    setShowCancelConfirm(false);
  };

  return (
    <>
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.IMPORT_WALLET}
        edgeAccountLogoutBefore={false}
        data={currentValues}
        processing={processing}
        submitAction={importWallet}
        onSuccess={onSuccess}
        onCancel={onPinCancel}
        setProcessing={setProcessing}
        hideProcessing={true}
      />
      <CancelConfirmModal
        show={showCancelConfirm}
        onClose={onCancelConfirmClose}
        onConfirm={onConfirmCancel}
      />
      <PseudoModalContainer
        title="Import FIO Wallet"
        onBack={onCancel}
        middleWidth={true}
      >
        <div className={classes.container}>
          <p className={classes.subtitle}>
            Enter the private key or mnemonic seed associated with your FIO
            wallet.
          </p>
          <p className={classes.description}>
            If you import a seed phrase, only the first FIO private key will be
            imported.
          </p>
          <ImportWalletForm
            loading={addWalletLoading || processing}
            onSubmit={onSubmit}
          />
          <CancelButton onClick={onCancel} isBlack={true} />
        </div>
      </PseudoModalContainer>
    </>
  );
};

export default ImportWalletPage;

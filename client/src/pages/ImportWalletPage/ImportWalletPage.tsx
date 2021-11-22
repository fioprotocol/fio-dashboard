import React, { useState } from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import ImportWalletForm from './components/ImportWalletForm';

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

import classes from './ImportWalletPage.module.scss';

const ImportWalletPage: React.FC<ContainerProps> = props => {
  const { loading, history, addWallet } = props;

  const [processing, setProcessing] = useState(false);
  const [currentValues, setCurrentValues] = useState<ImportWalletValues | null>(
    null,
  );

  const importWallet = async ({ edgeAccount, data }: SubmitActionParams) => {
    //
    const { privateSeed, name } = data;
    const newWallet = await edgeAccount.createCurrencyWallet(FIO_WALLET_TYPE, {
      ...DEFAULT_WALLET_OPTIONS,
      name,
      importText: privateSeed,
      // keyOptions: { format: '' }
    });

    return {
      edgeId: newWallet.id,
      name,
      publicKey: newWallet.getDisplayPublicSeed(),
      from: WALLET_CREATED_FROM.EDGE,
    };
  };

  const onSubmit = (values: ImportWalletValues) => {
    console.log(values);
    // todo: make validation
    setCurrentValues(values);
  };
  const onSuccess = (walletData: NewFioWalletDoublet) => {
    setCurrentValues(null);
    addWallet(walletData);
  };
  const onPinCancel = () => {
    setCurrentValues(null);
  };
  const onCancel = () => {
    history.push(ROUTES.TOKENS);
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
      <PseudoModalContainer
        title="Import FIO Wallet"
        link={ROUTES.TOKENS}
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
            loading={loading || processing}
            onSubmit={onSubmit}
          />
          <button
            type="button"
            onClick={onCancel}
            className={classes.cancelButton}
          >
            Cancel
          </button>
        </div>
      </PseudoModalContainer>
    </>
  );
};

export default ImportWalletPage;

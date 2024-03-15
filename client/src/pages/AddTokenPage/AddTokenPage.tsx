import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { AddTokenForm } from './components/AddTokenForm';
import { AddTokenMetamaskWallet } from './components/AddTokenMetamaskWallet';
import AddTokenEdgeWallet from './components/AddTokenEdgeWallet';
import AddTokenLedgerWallet from './components/AddTokenLedgerWallet';
import WalletAction from '../../components/WalletAction/WalletAction';

import { useContext } from './AddTokenPageContext';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { PublicAddressDoublet } from '../../types';

const AddToken: React.FC = () => {
  const {
    bundleCost,
    fioCryptoHandleObj,
    fioWallet,
    fioWallets,
    processing,
    results,
    submitData,
    changeBundleCost,
    onBack,
    onCancel,
    onRetry,
    onSubmit,
    onSuccess,
    setProcessing,
    validate,
    validateToken,
    publicAddresses,
  } = useContext();

  return (
    <>
      <WalletAction
        fioWallet={fioWallet}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.ADD_TOKEN}
        FioActionWallet={AddTokenEdgeWallet}
        LedgerActionWallet={AddTokenLedgerWallet}
        MetamaskActionWallet={AddTokenMetamaskWallet}
      />

      <Form
        onSubmit={onSubmit}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
        render={formProps => (
          <AddTokenForm
            formProps={formProps}
            fioCryptoHandleObj={fioCryptoHandleObj}
            results={results}
            bundleCost={bundleCost}
            fioWallets={fioWallets}
            changeBundleCost={changeBundleCost}
            onBack={() => onBack(formProps)}
            onRetry={onRetry}
            validateToken={(token: PublicAddressDoublet) =>
              validateToken(token, formProps.values)
            }
            publicAddresses={publicAddresses}
          />
        )}
      />
    </>
  );
};

export default AddToken;

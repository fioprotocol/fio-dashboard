import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { AddTokenForm } from './copmonents/AddTokenForm';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';
import { AddTokenMetamaskWallet } from './copmonents/AddTokenMetamaskWallet';

import { useContext } from './AddTokenPageContext';

import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';

import { PublicAddressDoublet } from '../../types';

const AddToken: React.FC = () => {
  const {
    bundleCost,
    edgeWalletId,
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
    setSubmitData,
    setProcessing,
    setResultsData,
    submit,
    validate,
    validateToken,
    publicAddresses,
  } = useContext();

  return (
    <>
      {fioWallet?.from === WALLET_CREATED_FROM.EDGE ? (
        <EdgeConfirmAction
          onSuccess={onSuccess}
          onCancel={onCancel}
          submitAction={submit}
          data={submitData}
          action={CONFIRM_PIN_ACTIONS.ADD_TOKEN}
          processing={processing}
          setProcessing={setProcessing}
          fioWalletEdgeId={edgeWalletId}
        />
      ) : null}

      {fioWallet?.from === WALLET_CREATED_FROM.LEDGER ? (
        <LedgerWalletActionNotSupported
          submitData={submitData}
          onCancel={onCancel}
        />
      ) : null}

      {fioWallet?.from === WALLET_CREATED_FROM.METAMASK ? (
        <AddTokenMetamaskWallet
          fioWallet={fioWallet}
          processing={processing}
          submitData={submitData}
          fioHandle={fioCryptoHandleObj?.name}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setSubmitData={setSubmitData}
          setResultsData={setResultsData}
          setProcessing={setProcessing}
        />
      ) : null}

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

import React from 'react';

import { Form } from 'react-final-form';

import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';
import { AddSocialMediaLinksForm } from './components/AddSocialMediaLinksForm';

import {
  WALLET_CREATED_FROM,
  CONFIRM_PIN_ACTIONS,
} from '../../constants/common';

import { useContext } from './AddSocialMediaLinksPageContext';

const AddSocialMediaLinkPage: React.FC = () => {
  const {
    bundleCost,
    fioCryptoHandleObj,
    fioWallet,
    onSuccess,
    onCancel,
    submit,
    submitData,
    processing,
    setProcessing,
    edgeWalletId,
    onSubmit,
    changeBundleCost,
    onRetry,
    socialMediaLinksList,
  } = useContext();

  return (
    <>
      {fioWallet?.from === WALLET_CREATED_FROM.EDGE ? (
        <EdgeConfirmAction
          onSuccess={onSuccess}
          onCancel={onCancel}
          submitAction={submit}
          data={submitData}
          action={CONFIRM_PIN_ACTIONS.ADD_SOCIAL_MEDIA_LINK}
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
      <Form
        onSubmit={onSubmit}
        render={formProps => (
          <AddSocialMediaLinksForm
            formProps={formProps}
            fioCryptoHandleObj={fioCryptoHandleObj}
            bundleCost={bundleCost}
            changeBundleCost={changeBundleCost}
            onRetry={onRetry}
            socialMediaLinksList={socialMediaLinksList}
          />
        )}
      />
    </>
  );
};

export default AddSocialMediaLinkPage;
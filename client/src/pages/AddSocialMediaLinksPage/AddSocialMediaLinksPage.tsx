import React from 'react';

import { Form } from 'react-final-form';

import { AddSocialMediaLinksForm } from './components/AddSocialMediaLinksForm';
import { AddSocialMediaLinksMetamaskWallet } from './components/AddSocialMediaLinksMetamaskWallet';

import WalletAction from '../../components/WalletAction/WalletAction';

import { AddSocialMediaLinksForm } from './components/AddSocialMediaLinksForm';
import { AddSocialMediaLinksEdgeWallet } from './components/AddSocialMediaLinksEdgeWallet';
import { AddSocialMediaLinksLedgerWallet } from './components/AddSocialMediaLinksLedgerWallet';

import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';

import { useContext } from './AddSocialMediaLinksPageContext';

const AddSocialMediaLinkPage: React.FC = () => {
  const {
    bundleCost,
    fioCryptoHandleObj,
    fioWallet,
    processing,
    setResultsData,
    setSubmitData,
    socialMediaLinksList,
    submitData,
    changeBundleCost,
    onCancel,
    onRetry,
    onSuccess,
    onSubmit,
    setProcessing,
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
        action={CONFIRM_PIN_ACTIONS.ADD_SOCIAL_MEDIA_LINK}
        FioActionWallet={AddSocialMediaLinksEdgeWallet}
        LedgerActionWallet={AddSocialMediaLinksLedgerWallet}
      />

      {fioWallet?.from === WALLET_CREATED_FROM.METAMASK ? (
        <AddSocialMediaLinksMetamaskWallet
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

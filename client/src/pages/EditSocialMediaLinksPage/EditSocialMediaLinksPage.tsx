import React from 'react';

import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';
import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import ActionContainer from '../../components/LinkTokenList/ActionContainer';

import { EditSocialMediaLinkItem } from './components/EditSocialMediaLinkItem';

import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { useContext } from './EditSocialMediaLinksPageContext';

import classes from './EditSocialMediaLinksPage.module.scss';

const EditSocialMediaLinksPage: React.FC = () => {
  const {
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    hasLowBalance,
    isDisabled,
    processing,
    socialMediaLinksList,
    submitData,
    changeBundleCost,
    handleEditTokenItem,
    onActionButtonClick,
    onBack,
    onCancel,
    onRetry,
    onSuccess,
    setProcessing,
    submit,
  } = useContext();

  return (
    <>
      {fioWallet?.from === WALLET_CREATED_FROM.EDGE ? (
        <EdgeConfirmAction
          onSuccess={onSuccess}
          onCancel={onCancel}
          submitAction={submit}
          data={submitData}
          action={CONFIRM_PIN_ACTIONS.EDIT_SOCIAL_MEDIA_LINK}
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

      <ActionContainer
        containerName={CONTAINER_NAMES.EDIT_SOCIAL_MEDIA}
        fioCryptoHandleObj={fioCryptoHandleObj}
        bundleCost={bundleCost}
        onActionButtonClick={onActionButtonClick}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
        isDisabled={isDisabled}
        link={ROUTES.FIO_SOCIAL_MEDIA_LINKS}
      >
        <h5 className={classes.text}>Linked Social Media Accounts</h5>
        {socialMediaLinksList &&
          socialMediaLinksList.map(socialMediaLinkItem => (
            <EditSocialMediaLinkItem
              {...socialMediaLinkItem}
              handleClick={handleEditTokenItem}
              hasLowBalance={hasLowBalance}
              key={socialMediaLinkItem.id}
            />
          ))}
      </ActionContainer>
    </>
  );
};

export default EditSocialMediaLinksPage;
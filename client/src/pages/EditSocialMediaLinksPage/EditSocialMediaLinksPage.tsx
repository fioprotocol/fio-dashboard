import React from 'react';

import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import WalletAction from '../../components/WalletAction/WalletAction';

import { EditSocialMediaLinkItem } from './components/EditSocialMediaLinkItem';
import { EditSocialMediaLinksEdgeWallet } from './components/EditSocialMediaLinksEdgeWallet';
import { EditSocialMediaLinksLedgerWallet } from './components/EditSocialMediaLinksLedgerWallet';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { useContext } from './EditSocialMediaLinksPageContext';

import classes from './EditSocialMediaLinksPage.module.scss';

const EditSocialMediaLinksPage: React.FC = () => {
  const {
    bundleCost,
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
        action={CONFIRM_PIN_ACTIONS.EDIT_SOCIAL_MEDIA_LINK}
        FioActionWallet={EditSocialMediaLinksEdgeWallet}
        LedgerActionWallet={EditSocialMediaLinksLedgerWallet}
      />

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

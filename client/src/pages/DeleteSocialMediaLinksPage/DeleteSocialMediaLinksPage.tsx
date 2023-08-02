import React from 'react';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import CheckedDropdown from '../DeleteTokenPage/components/CheckedDropdown';

import { DeleteSocialMediaLinkItem } from './components/DeleteSocialMediaLinkItem';

import { useContext } from './DeleteSocialMediaLinksPageContext';

import { ROUTES } from '../../constants/routes';
import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import {
  WALLET_CREATED_FROM,
  CONFIRM_PIN_ACTIONS,
} from '../../constants/common';

import classes from './DeleteSocialMediaLinksPage.module.scss';

const DeleteSocialMediaLinksPage: React.FC = () => {
  const {
    allChecked,
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    hasLowBalance,
    isDisabled,
    loading,
    processing,
    socialMediaLinksList,
    submitData,
    allCheckedChange,
    changeBundleCost,
    onActionClick,
    onBack,
    onCancel,
    onCheckClick,
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
          action={CONFIRM_PIN_ACTIONS.DELETE_TOKEN}
          processing={processing}
          setProcessing={setProcessing}
          fioWalletEdgeId={edgeWalletId}
        />
      ) : null}

      {/* TODO: handle ledger action */}
      {/* {fioWallet?.from === WALLET_CREATED_FROM.LEDGER ? (
        <LedgerWalletActionNotSupported
          submitData={submitData}
          onCancel={onCancel}
        />
      ) : null} */}

      <ActionContainer
        containerName={CONTAINER_NAMES.DELETE_SOCIAL_MEDIA}
        fioCryptoHandleObj={fioCryptoHandleObj}
        bundleCost={bundleCost}
        isDisabled={isDisabled}
        onActionButtonClick={onActionClick}
        loading={loading}
        link={ROUTES.FIO_SOCIAL_MEDIA_LINKS}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
      >
        <div className={classes.container}>
          <div className={classes.actionContainer}>
            <h5 className={classes.subtitle}>Linked Social Media Accounts</h5>
            <div className={classes.selectContainer}>
              <p className={classes.label}>Select</p>
              <CheckedDropdown
                allChecked={allChecked}
                allCheckedChange={allCheckedChange}
                hasLowBalance={hasLowBalance}
              />
            </div>
          </div>
          {socialMediaLinksList &&
            socialMediaLinksList.map(socialMediaLinkItem => (
              <DeleteSocialMediaLinkItem
                {...socialMediaLinkItem}
                onCheckClick={onCheckClick}
                hasLowBalance={hasLowBalance}
                key={socialMediaLinkItem.id}
              />
            ))}
        </div>
      </ActionContainer>
    </>
  );
};

export default DeleteSocialMediaLinksPage;

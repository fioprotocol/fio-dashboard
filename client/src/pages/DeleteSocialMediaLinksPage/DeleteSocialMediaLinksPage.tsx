import React from 'react';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import CheckedDropdown from '../DeleteTokenPage/components/CheckedDropdown';
import { DeleteSocialMediaLinkMetamaskWallet } from './components/DeleteSocialMediaLinkMetamaskWallet';
import WalletAction from '../../components/WalletAction/WalletAction';

import { DeleteSocialMediaLinkItem } from './components/DeleteSocialMediaLinkItem';
import { DeleteSocialMediaLinkEdgeWallet } from './components/DeleteSocialMediaLinkEdgeWallet';
import { DeleteSocialMediaLinkLedgerWallet } from './components/DeleteSocialMediaLinkLedgerWallet';

import { useContext } from './DeleteSocialMediaLinksPageContext';

import { ROUTES } from '../../constants/routes';
import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';

import classes from './DeleteSocialMediaLinksPage.module.scss';

const DeleteSocialMediaLinksPage: React.FC = () => {
  const {
    allChecked,
    allowDisconnectAll,
    bundleCost,
    checkedSocialMediaLinks,
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
    setResultsData,
    setSubmitData,
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
        action={CONFIRM_PIN_ACTIONS.DELETE_SOCIAL_MEDIA_LINK}
        FioActionWallet={DeleteSocialMediaLinkEdgeWallet}
        LedgerActionWallet={DeleteSocialMediaLinkLedgerWallet}
      />

      {fioWallet?.from === WALLET_CREATED_FROM.METAMASK ? (
        <DeleteSocialMediaLinkMetamaskWallet
          allowDisconnectAll={allowDisconnectAll}
          fioWallet={fioWallet}
          processing={processing}
          submitData={submitData}
          fioHandle={fioCryptoHandleObj?.name}
          checkedSocialMediaLinks={checkedSocialMediaLinks}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setSubmitData={setSubmitData}
          setResultsData={setResultsData}
          setProcessing={setProcessing}
        />
      ) : null}

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

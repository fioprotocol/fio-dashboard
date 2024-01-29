import React from 'react';
import classnames from 'classnames';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import PublicAddressEdit from './components/PublicAddressEdit';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';
import { EditTokenMetamaskWallet } from './components/EditTokenMetamaskWallet';

import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';

import { useContext } from './EditTokenPageContext';

import classes from './styles/EditTokenPage.module.scss';

const EditTokenPage: React.FC = () => {
  const {
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    fioWallets,
    hasLowBalance,
    isDisabled,
    processing,
    pubAddressesArr,
    resultsData,
    submitData,
    changeBundleCost,
    handleEditTokenItem,
    onActionClick,
    onBack,
    onCancel,
    onRetry,
    onSuccess,
    setProcessing,
    setResultsData,
    setSubmitData,
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
          action={CONFIRM_PIN_ACTIONS.EDIT_TOKEN}
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
        <EditTokenMetamaskWallet
          fioWallet={fioWallet}
          processing={processing}
          submitData={submitData}
          fioHandle={fioCryptoHandleObj?.name}
          pubAddressesArr={pubAddressesArr}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setSubmitData={setSubmitData}
          setResultsData={setResultsData}
          setProcessing={setProcessing}
        />
      ) : null}

      <ActionContainer
        containerName={CONTAINER_NAMES.EDIT}
        fioCryptoHandleObj={fioCryptoHandleObj}
        bundleCost={bundleCost}
        fioWallets={fioWallets}
        onActionButtonClick={onActionClick}
        results={resultsData}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
        isDisabled={isDisabled}
      >
        <div className={classes.container}>
          <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
            Linked Tokens
          </h5>
        </div>
        {pubAddressesArr &&
          pubAddressesArr.map(pubAddress => (
            <PublicAddressEdit
              {...pubAddress}
              handleClick={handleEditTokenItem}
              hasLowBalance={hasLowBalance}
              key={pubAddress.id}
            />
          ))}
      </ActionContainer>
    </>
  );
};

export default EditTokenPage;

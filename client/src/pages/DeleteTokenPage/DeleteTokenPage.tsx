import React from 'react';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import CheckedDropdown from './components/CheckedDropdown';
import DeleteTokenItem from './components/DeleteTokenItem';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';
import { DeleteTokenMetamaskWallet } from './components/DeleteTokenMetamaskWallet';

import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';

import { useContext } from './DeleteTokenPageContext';

import classes from './styles/DeleteToken.module.scss';

const DeleteTokenPage: React.FC = () => {
  const {
    allChecked,
    allowDisconnectAll,
    bundleCost,
    checkedPubAddresses,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    fioWallets,
    hasLowBalance,
    isDisabled,
    loading,
    processing,
    pubAddressesArr,
    resultsData,
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

      {fioWallet?.from === WALLET_CREATED_FROM.LEDGER ? (
        <LedgerWalletActionNotSupported
          submitData={submitData}
          onCancel={onCancel}
        />
      ) : null}

      {fioWallet?.from === WALLET_CREATED_FROM.METAMASK ? (
        <DeleteTokenMetamaskWallet
          allowDisconnectAll={allowDisconnectAll}
          fioWallet={fioWallet}
          processing={processing}
          submitData={submitData}
          fioHandle={fioCryptoHandleObj?.name}
          checkedPubAddresses={checkedPubAddresses}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setSubmitData={setSubmitData}
          setResultsData={setResultsData}
          setProcessing={setProcessing}
        />
      ) : null}

      <ActionContainer
        containerName={CONTAINER_NAMES.DELETE}
        fioCryptoHandleObj={fioCryptoHandleObj}
        bundleCost={bundleCost}
        fioWallets={fioWallets}
        isDisabled={isDisabled}
        onActionButtonClick={onActionClick}
        loading={loading}
        results={resultsData}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
      >
        <div className={classes.container}>
          <div className={classes.actionContainer}>
            <h5 className={classes.subtitle}>Linked Tokens</h5>
            <div className={classes.selectContainer}>
              <p className={classes.label}>Select</p>
              <CheckedDropdown
                allChecked={allChecked}
                allCheckedChange={allCheckedChange}
                hasLowBalance={hasLowBalance}
              />
            </div>
          </div>
          {pubAddressesArr &&
            pubAddressesArr.map(pubAddress => (
              <DeleteTokenItem
                {...pubAddress}
                onCheckClick={onCheckClick}
                hasLowBalance={hasLowBalance}
                key={pubAddress.id}
              />
            ))}
        </div>
      </ActionContainer>
    </>
  );
};

export default DeleteTokenPage;

import React from 'react';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import CheckedDropdown from './components/CheckedDropdown';
import DeleteTokenItem from './components/DeleteTokenItem';
import WalletAction from '../../components/WalletAction/WalletAction';
import DeleteTokenEdgeWallet from './components/DeleteTokenEdgeWallet';
import DeleteTokenLedgerWallet from './components/DeleteTokenLedgerWallet';

import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { useContext } from './DeleteTokenPageContext';

import classes from './styles/DeleteToken.module.scss';

const DeleteTokenPage: React.FC = () => {
  const {
    allChecked,
    bundleCost,
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
        action={CONFIRM_PIN_ACTIONS.DELETE_TOKEN}
        FioActionWallet={DeleteTokenEdgeWallet}
        LedgerActionWallet={DeleteTokenLedgerWallet}
      />

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

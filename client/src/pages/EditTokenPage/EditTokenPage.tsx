import React from 'react';
import classnames from 'classnames';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import PublicAddressEdit from './components/PublicAddressEdit';
import { EditTokenMetamaskWallet } from './components/EditTokenMetamaskWallet';
import WalletAction from '../../components/WalletAction/WalletAction';
import EditTokenEdgeWallet from './components/EditTokenEdgeWallet';
import EditTokenLedgerWallet from './components/EditTokenLedgerWallet';

import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';

import { useContext } from './EditTokenPageContext';

import classes from './styles/EditTokenPage.module.scss';

const EditTokenPage: React.FC = () => {
  const {
    bundleCost,
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
        action={CONFIRM_PIN_ACTIONS.EDIT_TOKEN}
        FioActionWallet={EditTokenEdgeWallet}
        LedgerActionWallet={EditTokenLedgerWallet}
      />

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

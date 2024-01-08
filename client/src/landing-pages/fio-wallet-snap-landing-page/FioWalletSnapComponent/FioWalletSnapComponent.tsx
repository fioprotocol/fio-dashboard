import React from 'react';

import CustomDropdown from '../../../components/CustomDropdown';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import { MetamaskSnapContext } from '../utils/MetamaskSnapContext';

import { useContext } from './FioWalletSnapComponentContext';
import { FioActionForms } from './components/FioActionForms';
import { SignNonce } from './components/SignNonce';

import {
  DECRYPT_FIO_REQUEST_CONTENT_NAME,
  DECRYPT_OBT_DATA_CONTENT_NAME,
  FIO_ACTIONS_OBJECT_LIST,
} from './constants';

import classes from './FioWalletSnapComponent.module.scss';

export const FioWalletSnapComponent: React.FC = () => {
  const metamaskSnapContext = MetamaskSnapContext();

  const {
    decryptedContent,
    decryptedError,
    decryptLoading,
    isSignatureVerified,
    publicKey,
    snapLoading,
    snapError,
    signature,
    signatureError,
    signatureLoading,
    signedTxn,
    signedTxnError,
    signedTxnLoading,
    state: metamaskState,
  } = metamaskSnapContext || {};

  const {
    activeAction,
    executedTxn,
    executedTxnError,
    executedTxnLoading,
    fioActionFormParams,
    nonce,
    onConnectClick,
    onActionChange,
    onExecuteTxn,
    onDecryptContent,
    onSignTxn,
    onSubmitActionForm,
    onSubmitSecret,
    signNonce,
  } = useContext(metamaskSnapContext);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <div className={classes.logo} />
        </div>
      </div>
      <div className={classes.contentContainer}>
        <h3 className={classes.title}>FIO Wallet Snap test page</h3>
        <SubmitButton
          onClick={onConnectClick}
          text="Connect MetaMask"
          withBottomMargin
          loading={snapLoading}
          disabled={snapLoading}
        />
        {snapError && (
          <p className={classes.snapErrorMessage}>{snapError.message}</p>
        )}
        {metamaskState?.enabled && !snapLoading ? (
          <>
            <hr />
            {publicKey && (
              <div>
                <h5>FIO Public Key</h5>
                <p>{publicKey}</p>
              </div>
            )}
            <hr />
            <h5>Sign and verify nonce</h5>
            <SignNonce
              signatureError={signatureError}
              signatureLoading={signatureLoading}
              isSignatureVerified={isSignatureVerified}
              nonce={nonce}
              signature={signature}
              onSubmit={onSubmitSecret}
              signNonce={signNonce}
            />
            <hr />
            <h5 className="mb-3">Select a FIO action</h5>
            <div className={classes.dropdown}>
              <CustomDropdown
                options={FIO_ACTIONS_OBJECT_LIST}
                onChange={onActionChange}
              />
              <FioActionForms
                action={activeAction}
                onSubmit={onSubmitActionForm}
              />
            </div>
            <hr />
            {activeAction === DECRYPT_FIO_REQUEST_CONTENT_NAME ||
            activeAction === DECRYPT_OBT_DATA_CONTENT_NAME ? (
              <SubmitButton
                onClick={onDecryptContent}
                text="Decrypt Content"
                disabled={decryptLoading || !fioActionFormParams}
                loading={decryptLoading}
                withTopMargin
                withBottomMargin
              />
            ) : (
              <SubmitButton
                onClick={onSignTxn}
                text="Sign Transaction"
                disabled={signedTxnLoading || !fioActionFormParams}
                loading={signedTxnLoading}
                withTopMargin
              />
            )}
            {decryptedError && (
              <p className={classes.snapErrorMessage}>
                {decryptedError?.message}
              </p>
            )}
            {decryptedContent && (
              <div>
                <h5 className="mt-4">Decrypted Content:</h5>
                {Object.entries(decryptedContent).map(([key, value]) => (
                  <p className={classes.txn} key={key}>
                    {key}: {JSON.stringify(value)}
                  </p>
                ))}
              </div>
            )}
            {signedTxnError && (
              <p className={classes.snapErrorMessage}>
                {signedTxnError?.message}
              </p>
            )}
            {signedTxn && (
              <div>
                <h5 className="mt-4">Signed transaction</h5>
                {Object.entries(signedTxn).map(([key, value]) => (
                  <p className={classes.txn} key={key}>
                    {key}: {JSON.stringify(value)}
                  </p>
                ))}
              </div>
            )}
            <hr />
            <SubmitButton
              onClick={onExecuteTxn}
              text="Execute Transaction"
              disabled={!signedTxn || executedTxnLoading}
              withTopMargin
              loading={executedTxnLoading}
            />
            <div className="mt-4">
              <h5>Transaction details</h5>
              {executedTxnError && (
                <p className={classes.snapErrorMessage}>
                  {executedTxnError?.message}
                </p>
              )}
              {executedTxn && (
                <>
                  <p>
                    Transaction:{' '}
                    <a
                      href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${executedTxn.transaction_id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {executedTxn.transaction_id}
                    </a>
                  </p>

                  <p>Processed:</p>
                  {executedTxn &&
                    executedTxn?.processed &&
                    Object.entries(executedTxn?.processed).map(
                      ([key, value]) => (
                        <p className={classes.txn} key={key}>
                          {key}: {JSON.stringify(value)}
                        </p>
                      ),
                    )}
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
      <section className={classes.footer}>
        <div className={classes.logoLink}>
          <div className={classes.logo} />
        </div>
      </section>
    </div>
  );
};

import React from 'react';

import CustomDropdown from '../../../components/CustomDropdown';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';

import {
  DECRYPT_FIO_REQUEST_CONTENT_NAME,
  DECRYPT_OBT_DATA_CONTENT_NAME,
  ENCRYPT_FIO_REQUEST_CONTENT_NAME,
  ENCRYPT_OBT_DATA_CONTENT_NAME,
  FIO_ACTIONS_OBJECT_LIST,
} from '../FioWalletSnapComponent/constants';

import { useContext } from './FioSdkLiteComponentContext';

import classes from './FioSdkLiteCopmonent.module.scss';
import { SignNonce } from '../FioWalletSnapComponent/components/SignNonce';
import { FioActionForms } from '../FioWalletSnapComponent/components/FioActionForms';

type Props = {};

export const FioSdkLiteComponent: React.FC<Props> = () => {
  const {
    activeAction,
    decryptedContent,
    decryptedError,
    encryptedContent,
    encryptedError,
    executedTxn,
    executedTxnError,
    executedTxnLoading,
    fioActionFormParams,
    isSignatureVerified,
    nonce,
    signature,
    signatureError,
    signedTxn,
    signedTxnLoading,
    signedTxnError,
    publicKey,
    onActionChange,
    onDecryptContent,
    onEncryptContent,
    onExecuteTxn,
    onPrivateKeyChange,
    onSignTxn,
    onSubmitActionForm,
    onSubmitSecret,
    signNonceByLib,
  } = useContext();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <div className={classes.logo} />
        </div>
      </div>
      <div className={classes.contentContainer}>
        <h3 className={classes.title}>FIO SDK Lite test page.</h3>
        <h6 className="mt-4">Type FIO Private key.</h6>

        <input type="string" onChange={onPrivateKeyChange} />

        <>
          <hr />
          <>
            <h5>Associated Public Key</h5>
            <p>{publicKey}</p>
          </>
          <hr />
          <h5>Sign and verify nonce</h5>
          <SignNonce
            signatureError={signatureError}
            isSignatureVerified={isSignatureVerified}
            nonce={nonce}
            signature={signature}
            onSubmit={onSubmitSecret}
            signNonce={signNonceByLib}
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
              disabled={!fioActionFormParams}
              withTopMargin
              withBottomMargin
            />
          ) : activeAction === ENCRYPT_FIO_REQUEST_CONTENT_NAME ||
            activeAction === ENCRYPT_OBT_DATA_CONTENT_NAME ? (
            <SubmitButton
              onClick={onEncryptContent}
              text="Encrypt Content"
              disabled={!fioActionFormParams}
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
          {encryptedContent && (
            <div>
              <h5 className="mt-4">Encrypted Content:</h5>
              <h5 className="mt-4 text-break" style={{ maxWidth: '500px' }}>
                {encryptedContent}
              </h5>
            </div>
          )}
          {encryptedError && (
            <p className={classes.snapErrorMessage}>
              {encryptedError?.message}
            </p>
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
            <h5>Transaction Details</h5>
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
                    href={`${
                      process.env.REACT_APP_FIO_BLOCKS_TX_URL
                    }${executedTxn.transaction_id as string}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {executedTxn.transaction_id}
                  </a>
                </p>

                <p>Processed:</p>
                {executedTxn &&
                  executedTxn?.processed &&
                  Object.entries(executedTxn?.processed).map(([key, value]) => (
                    <p className={classes.txn} key={key}>
                      {key}: {JSON.stringify(value)}
                    </p>
                  ))}
              </>
            )}
          </div>
        </>
      </div>
      <section className={classes.footer}>
        <div className={classes.logoLink}>
          <div className={classes.logo} />
        </div>
      </section>
    </div>
  );
};

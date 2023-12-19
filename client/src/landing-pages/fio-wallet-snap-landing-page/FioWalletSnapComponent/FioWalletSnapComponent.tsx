import React from 'react';

import CustomDropdown from '../../../components/CustomDropdown';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import { MetamaskSnapContext } from '../utils/MetamaskSnapContext';

import { useContext } from './FioWalletSnapComponentContext';
import { FioActionForms } from './FioActionForms';

import { FIO_ACTIONS_OBJECT_LIST } from './constants';

import classes from './FioWalletSnapComponent.module.scss';

export const FioWalletSnapComponent: React.FC = () => {
  const metamaskSnapContext = MetamaskSnapContext();

  const {
    publicKey,
    snapLoading,
    snapError,
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
    onConnectClick,
    onActionChange,
    onExecuteTxn,
    onSignTxn,
    onSubmitActionForm,
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
            <SubmitButton
              onClick={onSignTxn}
              text="Sign Transaction"
              disabled={signedTxnLoading || !fioActionFormParams}
              loading={signedTxnLoading}
              withTopMargin
            />
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

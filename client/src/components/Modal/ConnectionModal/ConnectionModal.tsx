import React from 'react';

import { Button } from 'react-bootstrap';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import classnames from 'classnames';

import Modal from '../Modal';

import { AnyType, PublicAddressDoublet } from '../../../types';
import apis from '../../../api';

import LedgerBadge from '../../Badges/LedgerBadge/LedgerBadge';
import { TransactionInfoBadge } from './components/TransactionInfoBadge';

import classes from './ConnectionModal.module.scss';

type TransactionDetails = {
  amount: string;
  fee?: number;
  contactsList: string[];
  tokens: PublicAddressDoublet[];
  socialMediaLinksList: Record<string, string>;
  feeRecordObtData: number;
  fromPubKey: string;
  nativeAmount: string;
  to: string;
  toPubKey: string;
};

type Props = {
  data: AnyType | null;
  show: boolean;
  onClose: () => void;
  onContinue?: () => void;
  message?: string;
  isTransaction?: boolean;
  isAwaiting?: boolean;
};

const ConnectionModal: React.FC<Props> = props => {
  const {
    data,
    show,
    message,
    isAwaiting,
    isTransaction,
    onClose,
    onContinue,
  } = props;

  const renderContinue = () => {
    if (!onContinue) return null;

    return (
      <Button
        className={`${classes.button} ${isTransaction ? classes.light : ''}`}
        onClick={onContinue}
      >
        Continue
      </Button>
    );
  };

  const renderRegular = () => (
    <>
      <ImportExportIcon className={classes.connectIcon} />
      <h4 className={classes.title}>Connect</h4>
      <p className={classes.text}>
        {message
          ? message
          : 'Please connect your Ledger device and open FIO App.'}
      </p>
      {renderContinue()}
      {!isAwaiting && !onContinue ? (
        <Button className={classes.button} onClick={onClose}>
          Close
        </Button>
      ) : null}
    </>
  );
  const renderTransaction = () => {
    const {
      fee,
      amount,
      nativeAmount,
      toPubKey,
      tokens,
      socialMediaLinksList,
    } = data as TransactionDetails;

    return (
      <div className={classes.transactionContent}>
        <LedgerBadge />
        <h4 className={classes.transactionTitle}>
          Confirm & Complete Transaction
        </h4>
        <p className={classes.transactionText}>
          Please connect your Ledger device, confirm these transaction details,
          and complete your transaction from your ledger device.
        </p>
        {renderContinue()}
        {toPubKey && (
          <TransactionInfoBadge title="FIO Public Address">
            {toPubKey}
          </TransactionInfoBadge>
        )}
        {(nativeAmount || amount) && (
          <TransactionInfoBadge title="Send Amount">
            {amount ?? apis.fio.sufToAmount(parseFloat(nativeAmount))} FIO
          </TransactionInfoBadge>
        )}
        {fee && (
          <TransactionInfoBadge title="Transaction Fee">
            {apis.fio.sufToAmount(fee)} FIO
          </TransactionInfoBadge>
        )}
        {socialMediaLinksList &&
          Object.keys(socialMediaLinksList).length > 0 && (
            <TransactionInfoBadge title="Mappings">
              {Object.keys(socialMediaLinksList).map(socialKey => [
                <b>SOCIAL:{socialKey}:</b>,
                socialMediaLinksList[socialKey],
                <br />,
              ])}
            </TransactionInfoBadge>
          )}
        {tokens && tokens.length > 0 && (
          <TransactionInfoBadge title="Mappings">
            {tokens.map(({ publicAddress, chainCode, tokenCode }) => [
              <b>
                {tokenCode}:{chainCode}:
              </b>,
              publicAddress,
              <br />,
            ])}
          </TransactionInfoBadge>
        )}
      </div>
    );
  };

  return (
    <Modal
      classNames={{
        dialog: classnames(isTransaction && classes.dialog),
      }}
      show={show}
      isBlue={!isTransaction}
      closeButton={!isAwaiting}
      onClose={!isAwaiting ? onClose : null}
    >
      {isTransaction ? renderTransaction() : renderRegular()}
    </Modal>
  );
};

export default ConnectionModal;

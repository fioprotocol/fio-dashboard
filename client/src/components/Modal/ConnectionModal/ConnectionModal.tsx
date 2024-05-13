import React from 'react';

import { Button } from 'react-bootstrap';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import classnames from 'classnames';

import Modal from '../Modal';

import classes from './ConnectionModal.module.scss';
import { AnyType } from '../../../types';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import apis from '../../../api';
import LedgerBadge from '../../Badges/LedgerBadge/LedgerBadge';

type TransactionDetails = {
  amount: string;
  fee?: number;
  contactsList: string[];
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
    const { amount, nativeAmount, fee, toPubKey } = data as TransactionDetails;

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
          <>
            <p className={classes.transactionBadgeLabel}>FIO Public Address</p>
            <Badge type={BADGE_TYPES.WHITE} show withoutMargin>
              <p className={classes.badgeContent}>{toPubKey}</p>
            </Badge>
          </>
        )}
        {(nativeAmount || amount) && (
          <>
            <p className={classes.transactionBadgeLabel}>Send Amount</p>
            <Badge type={BADGE_TYPES.WHITE} show withoutMargin>
              <p className={classes.badgeContent}>
                {amount ?? apis.fio.sufToAmount(parseFloat(nativeAmount))} FIO
              </p>
            </Badge>
          </>
        )}
        {fee && (
          <>
            <p className={classes.transactionBadgeLabel}>Transaction Fee</p>
            <Badge type={BADGE_TYPES.WHITE} show withoutMargin>
              <p className={classes.badgeContent}>
                {apis.fio.sufToAmount(fee)} FIO
              </p>
            </Badge>
          </>
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

import React from 'react';

import { Button } from 'react-bootstrap';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import Loader from '../../Loader/Loader';
import Modal from '../Modal';

import ledgerIcon from '../../../assets/images/ledger-logo-svg-vector.svg';

import classes from './ConnectionModal.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  onContinue?: () => void;
  message?: string;
  isTransaction?: boolean;
  awaitingLedger?: boolean;
};

const ConnectionModal: React.FC<Props> = props => {
  const {
    show,
    message,
    awaitingLedger,
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
      {!awaitingLedger && !onContinue ? (
        <Button className={classes.button} onClick={onClose}>
          Close
        </Button>
      ) : null}
    </>
  );
  const renderTransaction = () => (
    <>
      <img src={ledgerIcon} alt="LedgerIcon" className={classes.icon} />
      <h4 className={classes.transactionTitle}>Confirm Transaction</h4>
      <p className={classes.transactionText}>
        {message
          ? message
          : 'Please connect your Ledger device, open FIO App and confirm your transactions.'}
      </p>
      {renderContinue()}
      {awaitingLedger ? <Loader isWhite hasSmallSize className="mb-4" /> : null}
    </>
  );

  return (
    <Modal
      show={show}
      isBlue={!isTransaction}
      closeButton={!awaitingLedger}
      onClose={!awaitingLedger ? onClose : null}
    >
      {isTransaction ? renderTransaction() : renderRegular()}
    </Modal>
  );
};

export default ConnectionModal;

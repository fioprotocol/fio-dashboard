import React from 'react';
import Modal from '../Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

import ledgerIcon from '../../../assets/images/ledger-logo-svg-vector.svg';

import classes from './ConnectionModal.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  message?: string;
  isTransaction?: boolean;
};

const ConnectionModal: React.FC<Props> = props => {
  const { show, message, isTransaction, onClose } = props;

  const renderRegular = () => (
    <>
      <FontAwesomeIcon icon="exchange-alt" className={classes.icon} />
      <h4 className={classes.title}>Connect</h4>
      <p className={classes.text}>
        {message ? message : 'Please connect your Ledger device and confirm'}
      </p>
      <Button className={classes.button} onClick={onClose}>
        Close
      </Button>
    </>
  );
  const renderTransaction = () => (
    <>
      <img src={ledgerIcon} alt="LedgerIcon" className={classes.icon} />
      <h4 className={classes.transactionTitle}>
        Confirm <span className="doubleColor">Transaction</span>
      </h4>
      <p className={classes.transactionText}>
        {message
          ? message
          : 'Please connect your Ledger device and confirm your transactions.'}
      </p>
    </>
  );

  return (
    <Modal
      show={show}
      isBlue={!isTransaction}
      closeButton={true}
      onClose={onClose}
    >
      {isTransaction ? renderTransaction() : renderRegular()}
    </Modal>
  );
};

export default ConnectionModal;

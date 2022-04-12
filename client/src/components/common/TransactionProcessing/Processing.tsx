import React from 'react';

import Modal from '../../Modal/Modal';
import FioLoader from '../FioLoader/FioLoader';

import classes from '../../CheckoutPurchaseContainer/CheckoutPurchaseContainer.module.scss';

const DEFAULT_TEXT = {
  title: 'Transaction Processing',
  message: 'Hang tight while we process your transaction',
};

type Props = {
  isProcessing: boolean;
  title?: string;
  message?: string;
};

const Processing: React.FC<Props> = props => {
  const {
    isProcessing,
    title = DEFAULT_TEXT.title,
    message = DEFAULT_TEXT.message,
  } = props;
  return (
    <Modal
      show={isProcessing}
      backdrop="static"
      hideCloseButton
      closeButton={false}
    >
      <div className={classes.processingContainer}>
        <div className={classes.logo}>
          <FioLoader />
        </div>
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.subtitle}>{message}</p>
      </div>
    </Modal>
  );
};

export default Processing;

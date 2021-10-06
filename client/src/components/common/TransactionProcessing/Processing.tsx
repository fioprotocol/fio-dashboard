import React from 'react';
import Modal from '../../Modal/Modal';
import FioLoader from '../FioLoader/FioLoader';

import classes from '../../CheckoutPurchaseContainer/CheckoutPurchaseContainer.module.scss';

type Props = {
  isProcessing: boolean;
};

const Processing = (props: Props) => {
  return (
    <Modal
      show={props.isProcessing}
      backdrop="static"
      hideCloseButton
      closeButton={null}
      onClose={null}
    >
      <div className={classes.processingContainer}>
        <div className={classes.logo}>
          <FioLoader />
        </div>
        <h4 className={classes.title}>Transaction Processing</h4>
        <p className={classes.subtitle}>
          Hang tight while we process your transaction
        </p>
      </div>
    </Modal>
  );
};

export default Processing;

import React from 'react';
import Modal from '../../Modal/Modal';

import logoAnimation from '../../CreateAccountForm/logo-animation.json';
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
          <lottie-player
            id="logo-loading"
            autoplay
            loop
            mode="normal"
            src={JSON.stringify(logoAnimation)}
          ></lottie-player>
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

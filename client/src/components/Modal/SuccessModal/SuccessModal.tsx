import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../Modal';

import classes from './SuccessModal.module.scss';

type Props = {
  onClose: () => void;
  showModal: boolean;
  subtitle?: string;
  title?: string;
  buttonText?: string;
};

const SuccessModal: React.FC<Props> = props => {
  const { buttonText = 'Close', onClose, title, showModal, subtitle } = props;

  return (
    <Modal
      show={showModal}
      isSuccess={true}
      closeButton={true}
      onClose={onClose}
    >
      <div className={classes.container}>
        <FontAwesomeIcon icon="check" className={classes.icon} />
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.subtitle}>{subtitle}</p>
        <Button className={classes.button} onClick={onClose}>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;

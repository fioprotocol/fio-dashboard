import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../Modal';
import CancelButton from '../../common/CancelButton/CancelButton';

import classes from './DangerModal.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  onActionButtonClick: () => void;
  buttonText: string;
  showCancel: boolean;
  title: string;
  subtitle?: string;
};

const DangerModal: React.FC<Props> = props => {
  const {
    buttonText,
    onActionButtonClick,
    onClose,
    show,
    showCancel,
    subtitle,
    title,
  } = props;
  return (
    <Modal show={show} onClose={onClose} isDanger={true} closeButton={true}>
      <FontAwesomeIcon icon="ban" className={classes.icon} />
      <h4 className={classes.title}>{title}</h4>
      <p className={classes.subtitle}>{subtitle}</p>
      <Button onClick={onActionButtonClick} className={classes.actionButton}>
        {buttonText}
      </Button>
      {showCancel && (
        <div className={classes.cancelButton}>
          <CancelButton onClick={onClose} />
        </div>
      )}
    </Modal>
  );
};

export default DangerModal;

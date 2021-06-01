import React from 'react';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';
import classes from './Modal.module.scss';

const ModalComponent = props => {
  const {
    show,
    isDanger,
    title,
    onClose,
    closeButton,
    backdrop,
    hideCloseButton,
  } = props;
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      contentClassName={classnames(classes.modal, isDanger && classes.danger)}
      dialogClassName={classes.dialog}
      backdrop={backdrop}
    >
      {!hideCloseButton && (
        <Modal.Header closeButton={closeButton}>{title}</Modal.Header>
      )}
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default ModalComponent;

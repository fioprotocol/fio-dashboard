import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';
import classes from './Modal.module.scss';

const ModalComponent = props => {
  const {
    show: extShow,
    isDanger,
    title,
    onClose,
    closeButton,
    backdrop,
  } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => { 
    setShow(false);
    onClose();
  }
  const handleShow = () => setShow(true);

  useEffect(() => {
    extShow && handleShow();
  });
  return (
    <Modal
      show={show}
      onHide={handleClose}
      contentClassName={classnames(classes.modal, isDanger && classes.danger)}
      dialogClassName={classes.dialog}
      backdrop={backdrop}
    >
      <Modal.Header closeButton={closeButton}>{title}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default ModalComponent;

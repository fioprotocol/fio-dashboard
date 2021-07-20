import React from 'react';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';
import classes from './Modal.module.scss';

type Props = {
  backdrop?: boolean;
  children: React.ReactNode;
  closeButton: boolean;
  hideCloseButton?: boolean;
  isDanger?: boolean;
  isSimple?: boolean;
  onClose: () => void;
  show: boolean;
  title?: React.ReactNode | string;
};

const ModalComponent: React.FC<Props> = props => {
  const {
    backdrop,
    children,
    closeButton,
    hideCloseButton,
    isDanger,
    isSimple,
    onClose,
    show,
    title,
  } = props;
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      contentClassName={classnames(
        classes.modal,
        isDanger && classes.danger,
        isSimple && classes.simple,
      )}
      dialogClassName={classes.dialog}
      backdrop={backdrop}
    >
      {!hideCloseButton && (
        <Modal.Header closeButton={closeButton}>{title}</Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalComponent;

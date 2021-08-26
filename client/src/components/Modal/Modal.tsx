import React from 'react';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';
import classes from './Modal.module.scss';

type Props = {
  backdrop?: boolean | string;
  children: React.ReactNode;
  closeButton: boolean;
  hideCloseButton?: boolean;
  isDanger?: boolean;
  isSimple?: boolean;
  isSuccess?: boolean;
  onClose: () => void;
  show: boolean;
  title?: React.ReactNode | string;
  isWide?: boolean;
  hasDefaultColor?: boolean;
};

const ModalComponent: React.FC<Props> = props => {
  const {
    backdrop,
    children,
    closeButton,
    hideCloseButton,
    isDanger,
    isSimple,
    isSuccess,
    onClose,
    show,
    title,
    isWide,
    hasDefaultColor,
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
        isSuccess && classes.success,
      )}
      dialogClassName={classnames(
        classes.dialog,
        isWide && classes.isWide,
        hasDefaultColor && classes.defaultColor,
      )}
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

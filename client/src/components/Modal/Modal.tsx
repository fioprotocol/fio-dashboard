import React from 'react';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';

import classes from './Modal.module.scss';

type Props = {
  backdrop?: boolean | 'static';
  children: React.ReactNode;
  closeButton: boolean;
  hideCloseButton?: boolean;
  isDanger?: boolean;
  isSimple?: boolean;
  isSuccess?: boolean;
  isInfo?: boolean;
  onClose?: () => void;
  show: boolean;
  title?: React.ReactNode | string;
  isWide?: boolean;
  hasDefaultCloseColor?: boolean;
  isMiddleWidth?: boolean;
  isBlue?: boolean;
  withoutPaggingBottom?: boolean;
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
    isInfo,
    onClose,
    show,
    title,
    isWide,
    hasDefaultCloseColor,
    isMiddleWidth,
    isBlue,
    withoutPaggingBottom,
  } = props;
  const handleClose = () => {
    if (!onClose) return;
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
        isInfo && classes.info,
        isBlue && classes.blue,
        withoutPaggingBottom && classes.withoutPaggingBottom,
      )}
      dialogClassName={classnames(
        classes.dialog,
        isWide && classes.isWide,
        isMiddleWidth && classes.isMiddleWidth,
        hasDefaultCloseColor && classes.defaultCloseColor,
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

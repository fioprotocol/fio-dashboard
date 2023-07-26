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
  isIndigo?: boolean;
  isWhite?: boolean;
  onClose?: () => void;
  show: boolean;
  title?: React.ReactNode | string;
  isWide?: boolean;
  hasDefaultCloseColor?: boolean;
  isMiddleWidth?: boolean;
  isFullWidth?: boolean;
  isBlue?: boolean;
  withoutPaggingBottom?: boolean;
  enableOverflow?: boolean;
  headerClass?: string;
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
    isIndigo,
    isWhite,
    onClose,
    show,
    title,
    isWide,
    hasDefaultCloseColor,
    isMiddleWidth,
    isFullWidth,
    isBlue,
    withoutPaggingBottom,
    enableOverflow,
    headerClass,
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
        isIndigo && classes.indigo,
        isWhite && classes.isWhite,
        withoutPaggingBottom && classes.withoutPaggingBottom,
        enableOverflow && classes.enableOverflow,
      )}
      dialogClassName={classnames(
        classes.dialog,
        isWide && classes.isWide,
        isFullWidth && classes.fullWidth,
        isMiddleWidth && classes.isMiddleWidth,
        hasDefaultCloseColor && classes.defaultCloseColor,
      )}
      backdrop={backdrop}
    >
      {!hideCloseButton && (
        <Modal.Header closeButton={closeButton} className={headerClass}>
          {title}
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalComponent;

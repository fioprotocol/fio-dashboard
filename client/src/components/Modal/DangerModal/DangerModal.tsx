import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../Modal';
import CancelButton from '../../common/CancelButton/CancelButton';

import classes from './DangerModal.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  onActionButtonClick: () => void;
  buttonText: string;
  showCancel?: boolean;
  title: string;
  subtitle?: string | React.ReactNode;
  cancelButtonText?: string;
  loading?: boolean;
  footerContent?: React.ReactNode;
};

const DangerModal: React.FC<Props> = props => {
  const {
    buttonText,
    onActionButtonClick,
    onClose,
    show,
    showCancel,
    subtitle,
    cancelButtonText,
    title,
    loading,
    footerContent,
  } = props;
  return (
    <Modal show={show} onClose={onClose} isDanger={true} closeButton={!loading}>
      <FontAwesomeIcon icon="ban" className={classes.icon} />
      <h4 className={classes.title}>{title}</h4>
      <p className={classes.subtitle}>{subtitle}</p>
      <button
        onClick={onActionButtonClick}
        className={classes.actionButton}
        disabled={loading}
      >
        {buttonText}
        {loading && (
          <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />
        )}
      </button>
      {showCancel && (
        <div className={classes.cancelButton}>
          <CancelButton
            onClick={onClose}
            disabled={loading}
            text={cancelButtonText}
          />
        </div>
      )}
      {footerContent}
    </Modal>
  );
};

export default DangerModal;

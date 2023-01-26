import React from 'react';

import Modal from '../../../components/Modal/Modal';
import CancelButton from '../../../components/common/CancelButton/CancelButton';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';

import classes from '../styles/SendLinkModal.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  onClick: () => void;
  loading: boolean;
};

const SendLinkModal: React.FC<Props> = props => {
  const { show, onClose, onClick, loading } = props;
  return (
    <Modal show={show} onClose={onClose} closeButton={true}>
      <h4 className={classes.title}>
        Save <span className={classes.label}>Recovery Link</span>
      </h4>
      <p className={classes.subtitle}>
        To complete account recovery setup, you MUST first save the recovery
        link sent to you via email. This is required to recover your account in
        addition to your username and recovery questions.
      </p>
      <SubmitButton
        onClick={onClick}
        text={loading ? 'Sending...' : 'Send Email'}
        disabled={loading}
        loading={loading}
        withTopMargin={true}
      />
      <div className={classes.cancelButton}>
        <CancelButton onClick={onClose} isThin={true} />
      </div>
    </Modal>
  );
};

export default SendLinkModal;

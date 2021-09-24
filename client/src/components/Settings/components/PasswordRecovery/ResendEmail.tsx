import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import { EdgeAccount } from 'edge-core-js';
import SendLinkModal from './SendLinkModal';
import EmailModal from '../../../Modal/EmailModal';

import classes from './PasswordRecovery.module.scss';

const pinModalName = 'resendEmail';

type Props = {
  resendAction: (recoveryToken: string) => void;
  loading: boolean;
  showPinModal: (action: null, data: string) => void;
  pinConfirmation: { account: EdgeAccount; data?: string };
  getRecoveryToken: (account: EdgeAccount) => void;
  recoveryToken: string;
  clearRecoveryToken: () => void;
  resetPinConfirm: () => void;
  clearResendRecoveryResults: () => void;
  resendRecoveryResults: { success?: boolean };
  resending: boolean;
};

const ResendEmail: React.FC<Props> = props => {
  const {
    loading,
    showPinModal,
    pinConfirmation,
    getRecoveryToken,
    recoveryToken,
    clearRecoveryToken,
    resetPinConfirm,
    resendAction,
    clearResendRecoveryResults,
    resendRecoveryResults,
    resending,
  } = props;
  const [showSendEmailModal, toggleSendEmailModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);

  const onResendClick = () => {
    toggleSendEmailModal(true);
  };

  const onSendEmailClick = () => {
    showPinModal(null, pinModalName);
    toggleSendEmailModal(false);
  };

  const onSendEmailModalClose = () => {
    toggleSendEmailModal(false);
  };

  const onSuccessClose = () => {
    clearRecoveryToken();
    clearResendRecoveryResults();
    toggleSuccessModal(false);
  };

  useEffect(() => {
    if (!isEmpty(pinConfirmation)) {
      const { account, data } = pinConfirmation;
      if (data === pinModalName) {
        getRecoveryToken(account);
        toggleSendEmailModal(true);
      }
    }
  }, [pinConfirmation]);

  useEffect(() => {
    if (recoveryToken != null && recoveryToken !== '') {
      resetPinConfirm();
      resendAction(recoveryToken);
    }
  }, [recoveryToken]);

  useEffect(() => {
    if (resendRecoveryResults.success) {
      toggleSendEmailModal(false);
      toggleSuccessModal(true);
    }
  }, [resendRecoveryResults]);

  return (
    <>
      <Button onClick={onResendClick} className={classes.resendButton}>
        Resend Recovery Email
      </Button>
      <SendLinkModal
        show={showSendEmailModal}
        onClose={onSendEmailModalClose}
        onClick={onSendEmailClick}
        loading={loading || resending}
      />
      <EmailModal
        show={showSuccessModal}
        title="On the Way!"
        subtitle="An email with your recovery token has been sent to the email address entered."
        onClose={onSuccessClose}
      >
        <button onClick={onSuccessClose} className={classes.closeButton}>
          Close
        </button>
      </EmailModal>
    </>
  );
};

export default ResendEmail;

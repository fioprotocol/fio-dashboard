import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import SendLinkModal from './SendLinkModal';
import EmailModal from '../../../Modal/EmailModal';

import classes from './PasswordRecovery.module.scss';

type Props = {
  resendAction: () => void;
  loading: boolean;
};

const ResendEmail: React.FC<Props> = props => {
  const { resendAction, loading } = props;
  const [showSendEmailModal, toggleSendEmailModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);

  const onResendClick = () => {
    toggleSendEmailModal(true);
  };

  const onSendEmailClick = () => {
    resendAction();
    toggleSendEmailModal(false);
    toggleSuccessModal(true);
  };

  const onSendEmailModalClose = () => {
    toggleSendEmailModal(false);
  };

  const onSuccessClose = () => {
    toggleSuccessModal(false);
  };

  return (
    <>
      <Button onClick={onResendClick} className={classes.resendButton}>
        Resend Recovery Email
      </Button>
      <SendLinkModal
        show={showSendEmailModal}
        onClose={onSendEmailModalClose}
        onClick={onSendEmailClick}
        loading={loading}
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

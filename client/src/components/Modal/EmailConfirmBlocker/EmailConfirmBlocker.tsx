import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from '../EmailModal/EmailModal.module.scss';
import EmailModal from '../EmailModal';

type Props = {
  showEmailConfirmBlocker: boolean;
  loading: boolean;
  emailConfirmBlockerToken: string;
  closeEmailConfirmBlocker: () => void;
  resendConfirmEmail: (token: string) => void;
};

const EmailConfirmBlocker: React.FC<Props> = props => {
  const {
    emailConfirmBlockerToken,
    loading,
    showEmailConfirmBlocker,
    closeEmailConfirmBlocker,
    resendConfirmEmail,
  } = props;
  const onSend = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    resendConfirmEmail(emailConfirmBlockerToken);
  };
  return (
    <EmailModal
      show={showEmailConfirmBlocker}
      onClose={closeEmailConfirmBlocker}
      title="Please Verify Your Email"
      subtitle="Before you complete access to the FIO Dashboard you must verify your
        email address."
    >
      {loading ? (
        <p className={classes.footer}>
          <FontAwesomeIcon icon="spinner" spin />
        </p>
      ) : (
        <p className={classes.footer}>
          Didn't get an email?{' '}
          <a href="#" onClick={onSend} className={classes.sendLink}>
            Send Again
          </a>
        </p>
      )}
    </EmailModal>
  );
};

export default EmailConfirmBlocker;

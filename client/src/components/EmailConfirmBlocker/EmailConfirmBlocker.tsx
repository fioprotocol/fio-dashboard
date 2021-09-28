import React from 'react';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './EmailConfirmBlocker.module.scss';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

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
    <Modal
      show={showEmailConfirmBlocker}
      onClose={closeEmailConfirmBlocker}
      closeButton={true}
    >
      {loading ? (
        <FontAwesomeIcon icon="spinner" spin className={classes.icon} />
      ) : (
        <FontAwesomeIcon icon={faEnvelope} className={classes.icon} />
      )}
      <h4 className={classes.title}>Please Verify Your Email</h4>
      <p className={classes.subtitle}>
        Before you complete access to the FIO Dashboard you must verify your
        email address.
      </p>
      {loading ? null : (
        <p className={classes.footer}>
          Didn't get an email?{' '}
          <a href="#" onClick={onSend} className={classes.sendLink}>
            Send Again
          </a>
        </p>
      )}
    </Modal>
  );
};

export default EmailConfirmBlocker;

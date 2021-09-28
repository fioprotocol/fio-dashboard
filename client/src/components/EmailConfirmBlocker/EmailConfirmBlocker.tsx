import React from 'react';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './EmailConfirmBlocker.module.scss';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

type Props = {
  showEmailConfirmBlocker: boolean;
  closeEmailConfirmBlocker: () => void;
  resendConfirmEmail: () => void;
};

const EmailConfirmBlocker: React.FC<Props> = props => {
  const {
    showEmailConfirmBlocker,
    closeEmailConfirmBlocker,
    resendConfirmEmail,
  } = props;
  const onSend = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    resendConfirmEmail();
  };
  return (
    <Modal
      show={showEmailConfirmBlocker}
      onClose={closeEmailConfirmBlocker}
      closeButton={true}
    >
      <FontAwesomeIcon icon={faEnvelope} className={classes.icon} />
      <h4 className={classes.title}>Please Verify Your Email</h4>
      <p className={classes.subtitle}>
        Before you complete access to the FIO Dashboard you must verify your
        email address.
      </p>
      <p className={classes.footer}>
        Didn't get an email?{' '}
        <a href="#" onClick={onSend} className={classes.sendLink}>
          Send Again
        </a>
      </p>
    </Modal>
  );
};

export default EmailConfirmBlocker;

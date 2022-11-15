import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useContext } from './EmailConfirmBlockerContext';

import classes from '../EmailModal/EmailModal.module.scss';

const EmailConfirmBlocker: React.FC = () => {
  const { emailConfirmationSentTitle, loading, onSend } = useContext();

  return (
    <div className={classes.container}>
      <div>
        <FontAwesomeIcon icon="envelope" className={classes.icon} />
        <h4 className={classes.title}>Please Verify Your Email</h4>
        <p className={classes.subtitle}>
          Before you complete access to the FIO Dashboard you must verify your
          email address.
        </p>
        {loading ? (
          <p className={classes.footer}>
            <FontAwesomeIcon icon="spinner" spin />
          </p>
        ) : (
          <p className={classes.footer}>
            Didn't get an email?{' '}
            <span onClick={onSend} className={classes.sendLink}>
              Send Again
            </span>
          </p>
        )}
        {emailConfirmationSentTitle && (
          <p className="mt-0 mb-0">{emailConfirmationSentTitle}&nbsp;</p>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmBlocker;

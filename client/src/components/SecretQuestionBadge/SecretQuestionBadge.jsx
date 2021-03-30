import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './SecretQuestionBadge.module.scss';

const SecretQuestionBadge = props => {
  const { user, onClose, showModal } = props;
  if (!user) return null;
  const { secretSet } = user;

  return (
    <div className={classnames(classes.badge, !secretSet && classes.isSkipped)}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      {!secretSet ? (
        <p>
          <span className={classes.title}>Password Recovery</span> - You have
          skipped setting up password recovery, Please make sure to complete
          this so you do not loose access
        </p>
      ) : (
        <p>
          <span className={classes.title}>Account Create</span> - You're all set
          to start managing FIO Addresses, Domains, Requests as well as staying
          up to date
        </p>
      )}
      {!secretSet && (
        <FontAwesomeIcon
          icon="arrow-right"
          className={classes.arrow}
          onClick={showModal}
        />
      )}
      <FontAwesomeIcon
        icon="times-circle"
        className={classes.closeIcon}
        onClick={onClose}
      />
    </div>
  );
};

export default SecretQuestionBadge;

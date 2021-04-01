import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './NotificationBadge.module.scss';

export const BADGE_TYPES = {
  CREATE: 'create',
  RECOVERY: 'recovery',
};

const TYPE_TEXT = {
  [BADGE_TYPES.CREATE]: {
    title: 'Account Create',
    text:
      "You're all set to start managing FIO Addresses, Domains, Requests as well as staying",
  },
  [BADGE_TYPES.RECOVERY]: {
    title: 'Password Recovery',
    text:
      'You have skipped setting up password recovery, Please make sure to complete this so you do not loose access',
  },
};

const NotificationBadge = props => {
  const { onClose, arrowAction, type, hasArrow, warn } = props;

  return (
    <div className={classnames(classes.badge, warn && classes.isSkipped)}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      <p>
        <span className={classes.title}>{TYPE_TEXT[type].title}</span> -{' '}
        {TYPE_TEXT[type].text}
      </p>
      {hasArrow && (
        <FontAwesomeIcon
          icon="arrow-right"
          className={classes.arrow}
          onClick={arrowAction}
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

export default NotificationBadge;

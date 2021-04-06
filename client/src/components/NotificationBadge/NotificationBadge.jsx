import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './NotificationBadge.module.scss';

export const BADGE_TYPES = {
  WARNING: 'WARNING',
  ALERT: 'ALERT',
  ERROR: 'ERROR',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
};

const NotificationBadge = props => {
  const { onClose, arrowAction, type, title, message } = props;

  return (
    <div className={classnames(classes.badge, classes[type.toLowerCase()])}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      <p>
        <span className={classes.title}>{title}</span> - {message}
      </p>
      {arrowAction && (
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

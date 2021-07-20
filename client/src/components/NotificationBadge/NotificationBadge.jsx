import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge from '../Badge/Badge';
import classes from './NotificationBadge.module.scss';

const NotificationBadge = props => {
  const { onClose, arrowAction, type, title, message, show } = props;

  return (
    <Badge type={type} show={show}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      <p>
        <span className={classes.title}>{title}</span> - {message}
        {arrowAction && (
          <FontAwesomeIcon
            icon="arrow-right"
            className={classes.arrow}
            onClick={arrowAction}
          />
        )}
      </p>
      <FontAwesomeIcon
        icon="times-circle"
        className={classes.closeIcon}
        onClick={onClose}
      />
    </Badge>
  );
};

export default NotificationBadge;

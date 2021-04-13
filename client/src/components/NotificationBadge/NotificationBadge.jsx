import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge, { BADGE_BG_COLOR } from '../Badge/Badge';
import classes from './NotificationBadge.module.scss';

export const BADGE_TYPES = {
  CREATE: 'create',
  RECOVERY: 'recovery',
  ADDRESS_EXISTS: 'address_exists',
  AVAILABLE: 'available',
};

const TYPE_TEXT = {
  [BADGE_TYPES.CREATE]: {
    title: 'Account Create',
    text:
      "You're all set to start managing FIO Addresses, Domains, Requests as well as staying",
    bgColor: BADGE_BG_COLOR.INFO,
  },
  [BADGE_TYPES.RECOVERY]: {
    title: 'Password Recovery',
    text:
      'You have skipped setting up password recovery, Please make sure to complete this so you do not loose access',
    bgColor: BADGE_BG_COLOR.WARN,
  },
  [BADGE_TYPES.ERROR]: {
    title: 'Try Again!',
    bgColor: BADGE_BG_COLOR.WARN,
  },
  [BADGE_TYPES.AVAILABLE]: {
    title: 'Available!',
    text: 'The FIO address you requested is available',
    bgColor: BADGE_BG_COLOR.SUCCESS,
  },
};

const NotificationBadge = props => {
  const { onClose, arrowAction, type, hasArrow, show, message } = props;

  return (
    <Badge bgColor={TYPE_TEXT[type].bgColor} show={show}>
      <FontAwesomeIcon icon='exclamation-circle' className={classes.icon} />
      <p>
        <span className={classes.title}>{TYPE_TEXT[type].title}</span> -{' '}
        {TYPE_TEXT[type].text || message}
        {hasArrow && (
          <FontAwesomeIcon
            icon='arrow-right'
            className={classes.arrow}
            onClick={arrowAction}
          />
        )}
      </p>
      {onClose && (
        <FontAwesomeIcon
          icon='times-circle'
          className={classes.closeIcon}
          onClick={onClose}
        />
      )}
    </Badge>
  );
};

export default NotificationBadge;

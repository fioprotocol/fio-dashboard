import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge from '../Badge/Badge';
import classes from './NotificationBadge.module.scss';

type Props = {
  arrowAction?: () => void;
  noDash?: boolean;
  message: string | React.ReactNode;
  onClose: () => void;
  show: boolean;
  title: string | React.ReactNode;
  type: string;
};

const NotificationBadge: React.FC<Props> = props => {
  const { arrowAction, noDash, message, onClose, show, title, type } = props;

  return (
    <Badge type={type} show={show}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      <div className={classes.textContainer}>
        <span className={classes.title}>{title}</span>
        {!noDash && ' - '}
        {message}
        {arrowAction && (
          <FontAwesomeIcon
            icon="arrow-right"
            className={classes.arrow}
            onClick={arrowAction}
          />
        )}
      </div>
      <FontAwesomeIcon
        icon="times-circle"
        className={classes.closeIcon}
        onClick={onClose}
      />
    </Badge>
  );
};

export default NotificationBadge;

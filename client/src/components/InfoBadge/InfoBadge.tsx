import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge from '../Badge/Badge';
import classes from './InfoBadge.module.scss';

type Props = {
  message: string;
  show: boolean;
  title: string;
  type: string;
  hasBoldMessage?: boolean;
};

const InfoBadge: React.FC<Props> = props => {
  const { title, type, show, message, hasBoldMessage } = props;
  return (
    <Badge type={type} show={show}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      <p className={classes.textContainer}>
        <span className={classes.title}>{title}</span>
        <span className={hasBoldMessage ? classes.boldMessage : null}>
          {title && ' - '}
        </span>
        <span className={hasBoldMessage ? classes.boldMessage : null}>
          {message}
        </span>
      </p>
    </Badge>
  );
};

export default InfoBadge;

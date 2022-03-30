import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { CommonBadgeProps } from '../Badge/Badge';
import classes from './InfoBadge.module.scss';

export type InfoBadgeProps = {
  message: string | ReactElement;
  show: boolean;
  title: string;
  type: string;
  hasBoldMessage?: boolean;
} & CommonBadgeProps;

const InfoBadge: React.FC<InfoBadgeProps> = props => {
  const { title, type, show, message, hasBoldMessage, ...rest } = props;
  return (
    <Badge type={type} show={show} {...rest}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      <p className={classes.textContainer}>
        <span className={classes.title}>{title}</span>
        <span className={hasBoldMessage ? classes.boldMessage : ''}>
          {title && ' - '}
        </span>
        <span className={hasBoldMessage ? classes.boldMessage : ''}>
          {message}
        </span>
      </p>
    </Badge>
  );
};

export default InfoBadge;

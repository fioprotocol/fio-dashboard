import React, { ReactElement } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import classnames from 'classnames';

import Badge, { CommonBadgeProps } from '../Badge/Badge';
import classes from './InfoBadge.module.scss';

export type InfoBadgeProps = {
  hideDash?: boolean;
  iconOnTop?: boolean;
  message: string | ReactElement;
  messageOnNewLine?: boolean;
  messageOnLeft?: boolean;
  show: boolean;
  title: string;
  type: string;
  hasBoldMessage?: boolean;
} & CommonBadgeProps;

const InfoBadge: React.FC<InfoBadgeProps> = props => {
  const {
    hideDash,
    iconOnTop,
    title,
    type,
    show,
    message,
    messageOnNewLine,
    messageOnLeft,
    hasBoldMessage,
    ...rest
  } = props;
  return (
    <Badge type={type} show={show} {...rest}>
      <ErrorIcon
        className={classnames(classes.icon, iconOnTop && classes.iconOnTop)}
      />
      <div className={classes.textContainer}>
        <span className={classes.title}>{title}</span>
        <span className={hasBoldMessage ? classes.boldMessage : ''}>
          {title && hideDash ? ' ' : ' - '}
        </span>
        <span
          className={classnames(
            hasBoldMessage ? classes.boldMessage : '',
            messageOnNewLine && classes.messageOnNewLine,
            messageOnLeft && classes.messageOnLeft,
          )}
        >
          {message}
        </span>
      </div>
    </Badge>
  );
};

export default InfoBadge;

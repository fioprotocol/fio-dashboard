import React, { ReactElement } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';
import ErrorIcon from '@mui/icons-material/Error';
import classnames from 'classnames';

import Badge, { CommonBadgeProps } from '../Badge/Badge';
import classes from './InfoBadge.module.scss';

export type InfoBadgeProps = {
  hideDash?: boolean;
  iconOnTop?: boolean;
  icon?: React.ComponentType<SvgIconProps>;
  message: string | ReactElement;
  messageOnNewLine?: boolean;
  messageOnLeft?: boolean;
  show: boolean;
  title: string;
  type: string;
  hasBoldMessage?: boolean;
} & CommonBadgeProps;

interface IconComponentProps {
  icon?: React.ComponentType<SvgIconProps>;
  iconOnTop?: boolean;
}

const Icon: React.FC<IconComponentProps> = ({
  icon: IconComponent = ErrorIcon,
  iconOnTop,
}) => {
  return (
    <IconComponent
      className={classnames(classes.icon, iconOnTop && classes.iconOnTop)}
    />
  );
};

const InfoBadge: React.FC<InfoBadgeProps> = props => {
  const {
    hideDash,
    iconOnTop,
    icon,
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
      <Icon iconOnTop={iconOnTop} icon={icon} />
      <div className={classes.textContainer}>
        <span className={classes.title}>{title}</span>
        <span className={hasBoldMessage ? classes.boldMessage : ''}>
          {hideDash ? ' ' : title ? ' - ' : ' '}
        </span>
        <span
          className={classnames(
            hasBoldMessage ? classes.boldMessage : '',
            messageOnNewLine && classes.messageOnNewLine,
            messageOnLeft && classes.messageOnLeft,
            classes.message,
          )}
        >
          {message}
        </span>
      </div>
    </Badge>
  );
};

export default InfoBadge;

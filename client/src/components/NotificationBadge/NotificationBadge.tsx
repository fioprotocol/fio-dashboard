import React from 'react';
import ClearButton from '@mui/icons-material/Clear';
import WarningIcon from '@mui/icons-material/Warning';
import classnames from 'classnames';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import CheckMarkImageSrc from '../../assets/images/checked-circle.svg';

import classes from './NotificationBadge.module.scss';

type Props = {
  arrowAction?: () => void;
  className?: string;
  noDash?: boolean;
  message: string | React.ReactNode;
  onClose?: () => void;
  show: boolean;
  title?: string | React.ReactNode;
  type: string;
  mainIcon?: React.ReactElement | null;
  hasNewDesign?: boolean;
  marginBottomXs?: boolean;
  marginTopZero?: boolean;
  marginBottomZero?: boolean;
  marginAuto?: boolean;
  messageClassnames?: string;
  withoutMargin?: boolean;
};

type MainIconProps = {
  mainIcon?: React.ReactElement | null;
  type: string;
};

const MainIcon: React.FC<MainIconProps> = props => {
  const { mainIcon, type } = props;

  if (mainIcon) return mainIcon;

  if (type === BADGE_TYPES.INFO)
    return <img alt="Check Icon" src={CheckMarkImageSrc} />;

  return null;
};

const NotificationBadge: React.FC<Props> = props => {
  const {
    arrowAction,
    className,
    noDash,
    message,
    onClose,
    show,
    title,
    type,
    hasNewDesign,
    mainIcon,
    marginBottomXs,
    marginBottomZero,
    marginTopZero,
    marginAuto,
    messageClassnames,
    withoutMargin,
  } = props;

  if (hasNewDesign) {
    return (
      <Badge
        type={type}
        show={show}
        className={classnames(
          classes.badgeContainer,
          show && classes.show,
          marginBottomXs && classes.marginBottomXs,
          marginTopZero && classes.marginTopZero,
          marginAuto && classes.marginAuto,
          marginBottomZero && classes.marginBottomZero,
          className,
        )}
      >
        <MainIcon type={type} mainIcon={mainIcon} />

        {(type === BADGE_TYPES.ERROR ||
          type === BADGE_TYPES.WARNING ||
          type === BADGE_TYPES.ALERT ||
          type === BADGE_TYPES.RED) &&
          !mainIcon && <WarningIcon />}

        <div className={classes.contentContainer}>
          {title && <h5 className={classes.title}>{title}</h5>}
          <p className={classnames(classes.message, messageClassnames)}>
            {message}
          </p>
        </div>
        {onClose && (
          <ClearButton className={classes.clearIcon} onClick={onClose} />
        )}
      </Badge>
    );
  }

  return (
    <Badge
      type={type}
      show={show}
      withoutMargin={withoutMargin}
      className={className}
    >
      <ErrorIcon className={classes.icon} />
      <div className={classes.textContainer}>
        {title && <span className={classes.title}>{title}</span>}
        {!noDash && ' - '}
        {message}
        {arrowAction && (
          <ArrowForwardIcon className={classes.arrow} onClick={arrowAction} />
        )}
      </div>
      {onClose && (
        <CancelIcon className={classes.closeIcon} onClick={onClose} />
      )}
    </Badge>
  );
};

export default NotificationBadge;

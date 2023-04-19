import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import ClearButton from '@mui/icons-material/Clear';
import WarningIcon from '@mui/icons-material/Warning';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import CheckMarkImageSrc from '../../assets/images/checked-circle.svg';

import classes from './NotificationBadge.module.scss';

type Props = {
  arrowAction?: () => void;
  noDash?: boolean;
  message: string | React.ReactNode;
  onClose?: () => void | void;
  show: boolean;
  title: string | React.ReactNode;
  type: string;
  iconName?: IconName;
  mainIcon?: React.ReactElement | null;
  hasNewDesign?: boolean;
  marginBottomXs?: boolean;
  marginTopZero?: boolean;
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
    noDash,
    message,
    onClose,
    show,
    title,
    type,
    iconName,
    hasNewDesign,
    mainIcon,
    marginBottomXs,
    marginTopZero,
  } = props;

  if (hasNewDesign) {
    return (
      <Badge
        type={type}
        show={show}
        className={`${classes.badgeContainer} ${marginBottomXs &&
          classes.marginBottomXs} ${marginTopZero && classes.marginTopZero}`}
      >
        <MainIcon type={type} mainIcon={mainIcon} />

        {(type === BADGE_TYPES.ERROR ||
          type === BADGE_TYPES.WARNING ||
          type === BADGE_TYPES.ALERT) && <WarningIcon />}
        <div className={classes.contentContainer}>
          <h5 className={classes.title}>{title}</h5>
          <p className={classes.message}>{message}</p>
        </div>
        {onClose && (
          <ClearButton className={classes.clearIcon} onClick={onClose} />
        )}
      </Badge>
    );
  }

  return (
    <Badge type={type} show={show}>
      <FontAwesomeIcon
        icon={iconName || 'exclamation-circle'}
        className={classes.icon}
      />

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

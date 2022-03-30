import React from 'react';
import classnames from 'classnames';

import CloseButton from '../CloseButton/CloseButton';
import BackButton from '../common/BackButton/BackButton';

import classes from './PseudoModalContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  hasAutoWidth?: boolean;
  fullWidth?: boolean;
  middleWidth?: boolean;
  isInfo?: boolean;
  link?: string;
  onClose?: () => void;
  onBack?: () => void;
  title: string;
};

const PseudoModalContainer: React.FC<Props> = props => {
  const {
    children,
    hasAutoWidth,
    fullWidth,
    link,
    onClose,
    onBack,
    title,
    middleWidth,
    isInfo,
  } = props;
  return (
    <div
      className={classnames(
        classes.container,
        hasAutoWidth && classes.autoWidth,
        fullWidth && classes.fullWidth,
        middleWidth && classes.middleWidth,
        isInfo && classes.info,
      )}
    >
      <div className={classes.actionContainer}>
        {onClose && (
          <div className={classes.withClose}>
            <h2 className={classes.title}>{title}</h2>
            <CloseButton handleClick={onClose} />
          </div>
        )}
        {(link || onBack) && (
          <div className={classes.withBack}>
            <BackButton link={link || ''} onClick={onBack} />
            <h2 className={classes.title}>{title}</h2>
          </div>
        )}
        {link == null && onBack == null && onClose == null && title && (
          <div className={classes.singleTitle}>
            <h2 className={classes.title}>{title}</h2>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default PseudoModalContainer;

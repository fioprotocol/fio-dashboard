import React from 'react';
import CloseButton from '../CloseButton/CloseButton';
import BackButton from '../common/BackButton/BackButton';

import classes from './PseudoModalContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  link?: string;
  onClose?: () => void;
  title: string;
};

const PseudoModalContainer: React.FC<Props> = props => {
  const { children, link, onClose, title } = props;
  return (
    <div className={classes.container}>
      <div className={classes.actionContainer}>
        {onClose && (
          <div className={classes.withClose}>
            <h2 className={classes.title}>{title}</h2>
            <CloseButton handleClick={onClose} />
          </div>
        )}
        {link && (
          <div className={classes.withBack}>
            <BackButton link={link} />
            <h2 className={classes.title}>{title}</h2>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default PseudoModalContainer;

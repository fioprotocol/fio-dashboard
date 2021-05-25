import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CloseButton from '../CloseButton/CloseButton';

import classes from './PseudoModalContainer.module.scss';

const PseudoModalContainer = props => {
  const { children, onClose, title, onBack } = props;
  return (
    <div className={classes.container}>
      <div className={classes.actionContainer}>
        {onClose && (
          <div className={classes.withClose}>
            <h2 className={classes.title}>{title}</h2>
            <CloseButton handleClick={onClose} />
          </div>
        )}
        {onBack && (
          <div className={classes.withBack}>
            <FontAwesomeIcon
              icon="arrow-left"
              className={classes.arrow}
              onClick={onBack}
            />
            <h2 className={classes.title}>{title}</h2>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default PseudoModalContainer;

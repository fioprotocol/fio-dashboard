import React from 'react';
import classes from './CloseButton.module.scss';

const closeButton = props => {
  const { handleClick } = props;
  return <div className={classes.closeButton} onClick={handleClick} />;
};

export default closeButton;

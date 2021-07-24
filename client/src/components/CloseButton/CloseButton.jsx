import React from 'react';
import classnames from 'classnames';
import classes from './CloseButton.module.scss';

const closeButton = props => {
  const { handleClick, white = false } = props;
  return (
    <div
      className={classnames(classes.closeButton, white ? classes.white : null)}
      onClick={handleClick}
    />
  );
};

export default closeButton;

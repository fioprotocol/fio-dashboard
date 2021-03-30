import React from 'react';
import classes from './FormModalWrapper.module.scss';

const FormModalWrapper = props => {
  return <div className={classes.wrapper}>{props.children}</div>;
};

export default FormModalWrapper;

import React from 'react';
import classes from './FormModalWrapper.module.scss';

type Props = {
  children: React.ReactNode;
};

const FormModalWrapper: React.FC<Props> = props => {
  const { children } = props;
  return <div className={classes.wrapper}>{children}</div>;
};

export default FormModalWrapper;

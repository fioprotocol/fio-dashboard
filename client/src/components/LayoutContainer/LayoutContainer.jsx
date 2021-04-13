import React from 'react';
import classes from './LayoutContainer.module.scss';

const LayoutContainer = props => {
  const { children, title } = props;
  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{title}</h3>
      {children}
    </div>
  )
};

export default LayoutContainer;

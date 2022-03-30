import React from 'react';
import classnames from 'classnames';

import classes from './CounterContainer.module.scss';

const CounterContainer = props => {
  const { children, isEmpty } = props;

  return (
    <div className={classnames(classes.container, isEmpty && classes.isEmpty)}>
      {children}
    </div>
  );
};

export default CounterContainer;

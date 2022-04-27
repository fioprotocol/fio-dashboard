import React from 'react';
import classnames from 'classnames';

import classes from './CounterContainer.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  isEmpty?: boolean;
};

const CounterContainer: React.FC<Props> = props => {
  const { children, isEmpty } = props;

  return (
    <div className={classnames(classes.container, isEmpty && classes.isEmpty)}>
      {children}
    </div>
  );
};

export default CounterContainer;

import React from 'react';
import classes from './LayoutContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  title: string;
};

const LayoutContainer: React.FC<Props> = props => {
  const { children, title } = props;
  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{title}</h3>
      {children}
    </div>
  );
};

export default LayoutContainer;

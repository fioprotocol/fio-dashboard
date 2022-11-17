import React from 'react';

import classes from './MainLayoutContainer.module.scss';

export const MainLayoutContainer: React.FC = props => {
  return <div className={classes.root}>{props.children}</div>;
};

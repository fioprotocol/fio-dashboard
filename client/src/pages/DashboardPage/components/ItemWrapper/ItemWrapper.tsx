import React from 'react';

import classes from './ItemWrapper.module.scss';

export const ItemWrapper: React.FC = props => {
  return <div className={classes.container}>{props.children}</div>;
};

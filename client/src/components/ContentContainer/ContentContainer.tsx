import React from 'react';

import classes from './ContentContainer.module.scss';

export const ContentContainer: React.FC = props => {
  return <div className={classes.content}>{props.children}</div>;
};

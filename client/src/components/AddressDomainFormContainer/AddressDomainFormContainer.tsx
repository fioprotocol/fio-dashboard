import React from 'react';

import classes from './AddressDomainFormContainer.module.scss';

export const AddressDomainFormContainer: React.FC = props => {
  return <div className={classes.container}>{props.children}</div>;
};

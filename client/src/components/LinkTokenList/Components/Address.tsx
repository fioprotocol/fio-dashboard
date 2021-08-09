import React from 'react';

import { NameType } from '../types';
import classes from '../LinkToken.module.scss';

export const RenderAddressName: React.FC<NameType> = props => {
  const { name } = props;
  return (
    <div className={classes.addressContainer}>
      <h5 className={classes.ad}>Address:</h5>
      <h5 className={classes.name}>{name}</h5>
    </div>
  );
};
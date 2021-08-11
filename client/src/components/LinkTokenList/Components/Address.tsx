import React from 'react';

import { NameType } from '../types';
import classes from './ComponentsStyles.module.scss';

const AddressName: React.FC<NameType> = props => {
  const { name } = props;
  return (
    <div className={classes.addressContainer}>
      <h5 className={classes.title}>Address:</h5>
      <h5 className={classes.name}>{name}</h5>
    </div>
  );
};

export default AddressName;

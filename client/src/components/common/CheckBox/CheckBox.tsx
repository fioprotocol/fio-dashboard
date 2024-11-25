import React from 'react';
import classnames from 'classnames';
import { Checkbox, CheckboxProps } from '@mui/material';

import classes from './CheckBox.module.scss';

export const CheckBox: React.FC<CheckboxProps> = props => {
  return (
    <Checkbox
      {...props}
      className={classnames(classes.checkbox, props.className)}
    />
  );
};

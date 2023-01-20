import React from 'react';
import CheckCircle from '@mui/icons-material/CheckCircle';
import classnames from 'classnames';

import classes from './CheckIconComponent.module.scss';

type Props = {
  isGreen?: boolean;
  fontSize?: string;
};

export const CheckIconComponent: React.FC<Props> = props => {
  const { isGreen, fontSize } = props;

  return (
    <CheckCircle
      style={{ fontSize }}
      className={classnames(isGreen && classes.isGreen)}
    />
  );
};

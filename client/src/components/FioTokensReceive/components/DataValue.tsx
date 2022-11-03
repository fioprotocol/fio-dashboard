import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { copyToClipboard } from '../../../util/general';

import classes from '../FioTokensReceive.module.scss';

type Props = {
  value: string;
};

export const DataValue: React.FC<Props> = props => {
  const onClick = () => {
    copyToClipboard(props.value);
  };

  return (
    <div className={classes.value}>
      {props.value}
      <FontAwesomeIcon
        className={classes.icon}
        icon={{ prefix: 'far', iconName: 'copy' }}
        onClick={onClick}
      />
    </div>
  );
};

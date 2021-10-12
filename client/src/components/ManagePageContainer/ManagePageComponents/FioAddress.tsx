import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BoolStateFunc } from '../types';

import classes from './FioAddress.module.scss';

type Props = {
  name: string;
  showInfoBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
};

const FioAddress: React.FC<Props> = props => {
  const { name, showInfoBadge, toggleShowInfoBadge } = props;
  return (
    <div className={classes.nameContainer}>
      <p className={classes.name}>{name}</p>
      {showInfoBadge && (
        <FontAwesomeIcon
          icon="exclamation-triangle"
          className={classes.infoIcon}
          onClick={() => toggleShowInfoBadge(true)}
        />
      )}
    </div>
  );
};

export default FioAddress;

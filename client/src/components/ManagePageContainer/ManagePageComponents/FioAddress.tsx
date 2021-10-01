import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BoolStateFunc, IsExpiredFunc } from '../types';

import classes from './FioAddress.module.scss';

type Props = {
  name: string;
  showInfoBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  isDesktop: boolean;
  expiration?: Date;
  toggleShowWarnBadge?: BoolStateFunc;
  isExpired?: IsExpiredFunc;
};

const FioAddress: React.FC<Props> = props => {
  const {
    name,
    showInfoBadge,
    toggleShowInfoBadge,
    isDesktop,
    isExpired,
    expiration,
    toggleShowWarnBadge,
  } = props;
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
      {!isDesktop && isExpired(expiration) && (
        <FontAwesomeIcon
          icon="exclamation-triangle"
          className={classes.warnIcon}
          onClick={() => toggleShowWarnBadge(true)}
        />
      )}
    </div>
  );
};

export default FioAddress;

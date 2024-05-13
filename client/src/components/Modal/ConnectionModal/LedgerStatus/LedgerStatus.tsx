import React from 'react';

import CommonBadge from '../../../Badges/CommonBadge/CommonBadge';

import classes from './LedgerStatus.module.scss';
import ledgerIcon from '../../../../assets/images/ledger-logo-svg-vector.svg';

export const LedgerStatus: React.FC = () => {
  return (
    <div className={classes.container}>
      <CommonBadge isPurple={true}>
        <div className={classes.ledgerBadge}>
          <img
            src={ledgerIcon}
            alt="LedgerIcon"
            className={classes.ledgerIcon}
          />
          <p className={classes.ledgerText}>Ledger Connected</p>
        </div>
      </CommonBadge>
    </div>
  );
};

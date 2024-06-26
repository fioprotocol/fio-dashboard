import React from 'react';

import CommonBadge from '../CommonBadge/CommonBadge';

import classes from './LedgerBadge.module.scss';
import ledgerIcon from '../../../assets/images/ledger-logo-svg-vector.svg';

type Props = {
  color?: 'black' | 'purple';
};

const LedgerBadge: React.FC<Props> = ({ color = 'black' }) => {
  return (
    <div className={classes.container}>
      <CommonBadge isBlack={color === 'black'} isPurple={color === 'purple'}>
        <div className={classes.ledgerBadge}>
          <img
            src={ledgerIcon}
            alt="LedgerIcon"
            className={classes.ledgerIcon}
          />
          <p className={classes.ledgerText}>Ledger Wallet</p>
        </div>
      </CommonBadge>
    </div>
  );
};

export default LedgerBadge;

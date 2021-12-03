import React from 'react';
import CommonBadge from '../CommonBadge/CommonBadge';
import classes from './LedgerBadge.module.scss';
import ledgerIcon from '../../../assets/images/ledger-logo-svg-vector.svg';

const LedgerBadge: React.FC = () => {
  return (
    <div className={classes.container}>
      <CommonBadge isBlack={true}>
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

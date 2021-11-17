import React from 'react';
import { Button } from 'react-bootstrap';

import classes from '../styles/TransactionHistory.module.scss';

type Props = {
  actorName: string;
};

const TransactionHistory: React.FC<Props> = props => {
  return (
    <div className={classes.container}>
      <div className={classes.transaction}>
        <h5 className={classes.title}>Transaction History</h5>
        <p className={classes.text}>
          To view your transaction history for this wallet, you can view by
          going to the explorer.
        </p>
        <Button className={classes.button}>
          <a
            href={`${process.env.REACT_APP_FIO_BLOCKS_ACCOUNT_URL}${props.actorName}`}
            target="_blank"
            rel="noreferrer"
          >
            View Transaction History
          </a>
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistory;

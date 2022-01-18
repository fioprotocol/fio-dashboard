import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import Results from '../index';

import apis from '../../../../api';

import { ResultsProps } from '../types';

import classes from '../styles/Results.module.scss';

type TokenTransferResultsProps = ResultsProps & { roe: number };

const TokenTransferResults: React.FC<TokenTransferResultsProps> = props => {
  const {
    results: {
      other: { to, from, amount, transaction_id, memo },
    },
    roe,
    titleTo,
    titleFrom,
    titleAmount,
  } = props;

  const fioAmount = apis.fio.sufToAmount(amount);
  const usdcAmount = apis.fio.convertFioToUsdc(amount, roe);
  return (
    <Results {...props}>
      <p className={classes.label}>Transfer Information</p>
      {from && (
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div
            className={classnames(classes.badgeContainer, classes.longTitle)}
          >
            <p className={classes.title}>
              {titleFrom || 'Sending FIO Crypto Handle'}
            </p>
            <p className={classes.item}>{from}</p>
          </div>
        </Badge>
      )}
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>
            {titleTo || 'Send to FIO Crypto Handle'}
          </p>
          <p className={classes.item}>{to}</p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>{titleAmount || 'Amount Sent'}</p>
          <p className={classes.item}>
            {fioAmount.toFixed(2)} FIO / {usdcAmount.toFixed(2)} USDC
          </p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>ID</p>
          <p className={classnames(classes.item, classes.isBlue)}>
            <a
              href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${transaction_id}`}
              target="_blank"
              rel="noreferrer"
            >
              {transaction_id}
            </a>
          </p>
        </div>
      </Badge>
      {memo && (
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div
            className={classnames(classes.badgeContainer, classes.longTitle)}
          >
            <p className={classes.title}>Memo</p>
            <p className={classes.item}>{memo}</p>
          </div>
        </Badge>
      )}
    </Results>
  );
};

export default TokenTransferResults;

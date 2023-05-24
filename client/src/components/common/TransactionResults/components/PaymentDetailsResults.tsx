import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import Results from '../index';

import classes from '../styles/Results.module.scss';
import { PaymentDetailsResultValues } from '../../../../pages/TokensRequestPaymentPage/types';
import { priceToNumber } from '../../../../utils';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';
import Amount from '../../Amount';

type TokenTransferResultsProps = {
  title: string;
  onClose: () => void;
  onRetry?: () => void;
  results: PaymentDetailsResultValues;
};

const PaymentDetailsResults: React.FC<TokenTransferResultsProps> = props => {
  const {
    results: {
      payeeFioAddress,
      amount,
      chainCode,
      tokenCode,
      transactionId,
      memo,
    },
  } = props;

  const renderAmount = () => {
    const price = priceToNumber(amount);
    return (
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Amount</p>
          <p className={classes.item}>
            <span>
              <ConvertedAmount fioAmount={price} /> (<Amount value={price} />
              {' ' + tokenCode})
            </span>
          </p>
        </div>
      </Badge>
    );
  };

  return (
    <Results {...props}>
      <p className={classes.label}>Transfer Information</p>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>To</p>
          <p className={classes.item}>{payeeFioAddress}</p>
        </div>
      </Badge>
      {renderAmount()}
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Chain</p>
          <p className={classes.item}>{chainCode}</p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>ID</p>
          <p className={classnames(classes.item, classes.isIndigo)}>
            <a
              href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${transactionId}`}
              target="_blank"
              rel="noreferrer"
            >
              {transactionId}
            </a>
          </p>
        </div>
      </Badge>
      <Badge show={!!memo} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Memo</p>
          <p className={classes.item}>{memo}</p>
        </div>
      </Badge>
    </Results>
  );
};

export default PaymentDetailsResults;

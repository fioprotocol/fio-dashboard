import React from 'react';

import Results from '../index';

import classes from '../styles/Results.module.scss';
import { PaymentDetailsResultValues } from '../../../../pages/TokensRequestPaymentPage/types';
import { priceToNumber } from '../../../../utils';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';
import Amount from '../../Amount';
import { ResultDetails } from '../../../ResultDetails/ResultDetails';

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

  const price = priceToNumber(amount);

  return (
    <Results {...props}>
      <p className={classes.label}>Transfer Information</p>

      <ResultDetails label="To" value={payeeFioAddress} />

      <ResultDetails
        label="Amount"
        value={
          <span>
            <ConvertedAmount fioAmount={price} /> (<Amount value={price} />
            {' ' + tokenCode})
          </span>
        }
      />

      <ResultDetails label="Chain" value={chainCode} />

      <ResultDetails
        label="ID"
        value={
          <a
            href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${transactionId}`}
            target="_blank"
            rel="noreferrer"
          >
            {transactionId}
          </a>
        }
      />

      <ResultDetails show={!!memo} label="Memo" value={memo} />
    </Results>
  );
};

export default PaymentDetailsResults;

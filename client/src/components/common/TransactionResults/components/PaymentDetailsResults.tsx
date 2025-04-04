import React from 'react';

import Results from '../index';

import { PaymentDetailsResultValues } from '../../../../pages/TokensRequestPaymentPage/types';
import { ResultDetails } from '../../../ResultDetails/ResultDetails';
import { PriceComponent } from '../../../PriceComponent';

import { useConvertFioToUsdc } from '../../../../util/hooks';

import classes from '../styles/Results.module.scss';

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
      amount: fioAmount,
      chainCode,
      tokenCode,
      transactionId,
      memo,
    },
  } = props;

  const usdcPrice = useConvertFioToUsdc({ fioAmount });

  return (
    <Results {...props}>
      <p className={classes.label}>Transfer Information</p>

      <ResultDetails label="To" value={payeeFioAddress} />

      <ResultDetails
        label="Amount"
        value={
          <PriceComponent
            className={classes.priceValue}
            costFio={fioAmount}
            costUsdc={usdcPrice}
            tokenCode={tokenCode}
          />
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

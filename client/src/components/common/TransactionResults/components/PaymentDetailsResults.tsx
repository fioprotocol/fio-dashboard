import React from 'react';

import Results from '../index';

import { PaymentDetailsResultValues } from '../../../../pages/TokensRequestPaymentPage/types';
import { ResultDetails } from '../../../ResultDetails/ResultDetails';

import classes from '../styles/Results.module.scss';
import { PriceComponent } from '../../../PriceComponent';
import { useConvertFioToUsdc } from '../../../../util/hooks';

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

  const fioAmount = Number(amount);
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
            costFio={fioAmount.toString(10)}
            costUsdc={usdcPrice.toString(10)}
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

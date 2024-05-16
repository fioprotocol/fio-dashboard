import React from 'react';

import Results from '../index';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';
import Amount from '../../Amount';
import { FIO_CHAIN_CODE } from '../../../../constants/fio';

import { ResultsProps } from '../types';

import { ResultDetails } from '../../../ResultDetails/ResultDetails';

import classes from '../styles/Results.module.scss';

type TokenTransferResultsProps = ResultsProps;

const StakeTokensResults: React.FC<TokenTransferResultsProps & {
  labelAmount?: string;
  topElement?: React.ReactNode;
}> = props => {
  const {
    results: {
      other: { amount, nativeAmount },
    },
    titleAmount = 'Amount Staked',
    labelAmount = 'Staking Information',
    topElement = null,
  } = props;

  const fioAmount = Number(amount);
  const displayAmount = (
    <>
      <Amount value={fioAmount.toFixed(2)} /> {FIO_CHAIN_CODE}
    </>
  );
  const displayUsdcAmount = (
    <>
      <ConvertedAmount fioAmount={fioAmount} nativeAmount={nativeAmount} />
    </>
  );

  return (
    <Results {...props}>
      {topElement}

      <p className={classes.label}>{labelAmount}</p>
      <ResultDetails
        label={titleAmount}
        value={
          <>
            {displayUsdcAmount} ({displayAmount})
          </>
        }
      />
    </Results>
  );
};

export default StakeTokensResults;

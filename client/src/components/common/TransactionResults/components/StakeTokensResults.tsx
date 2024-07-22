import React from 'react';

import Results from '../index';

import { ResultsProps } from '../types';

import { ResultDetails } from '../../../ResultDetails/ResultDetails';
import { PriceComponent } from '../../../PriceComponent';

import { useConvertFioToUsdc } from '../../../../util/hooks';

import classes from '../styles/Results.module.scss';

const StakeTokensResults: React.FC<ResultsProps & {
  labelAmount?: string;
  topElement?: React.ReactNode;
}> = props => {
  const {
    results: {
      other: { amount },
    },
    titleAmount = 'Amount Staked',
    labelAmount = 'Staking Information',
    topElement = null,
  } = props;

  const fioAmount = Number(amount);
  const usdcPrice = useConvertFioToUsdc({ fioAmount });

  return (
    <Results {...props}>
      {topElement}

      <p className={classes.label}>{labelAmount}</p>
      <ResultDetails
        label={titleAmount}
        value={
          <PriceComponent
            className={classes.priceValue}
            costFio={fioAmount.toString(10)}
            costUsdc={usdcPrice.toString(10)}
          />
        }
      />
    </Results>
  );
};

export default StakeTokensResults;

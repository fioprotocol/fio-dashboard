import React from 'react';
import classnames from 'classnames';

import Results from '../index';
import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';
import Amount from '../../Amount';
import { FIO_CHAIN_CODE } from '../../../../constants/fio';

import { ResultsProps } from '../types';

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
      / <ConvertedAmount fioAmount={fioAmount} nativeAmount={nativeAmount} />
    </>
  );

  return (
    <Results {...props}>
      {topElement}

      <p className={classes.label}>{labelAmount}</p>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>{titleAmount}</p>
          <p className={classes.item}>
            {displayAmount} {displayUsdcAmount}
          </p>
        </div>
      </Badge>
    </Results>
  );
};

export default StakeTokensResults;

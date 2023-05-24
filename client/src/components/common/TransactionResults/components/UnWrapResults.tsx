import React from 'react';
import classnames from 'classnames';

import Results from '../index';
import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';
import Amount from '../../Amount';

import { FIO_CHAIN_CODE } from '../../../../constants/fio';
import { ROUTES } from '../../../../constants/routes';

import { ResultsProps } from '../types';
import { AnyObject } from '../../../../types';

import classes from '../styles/Results.module.scss';

export type ResultsData = {
  amount?: string;
  chainCode: string;
  publicAddress: string;
  receivingAddress: string;
  fioDomain?: string;
  other?: { transaction_id?: string } & AnyObject;
  error?: string | null;
};

type UnWrapResultsProps = {
  isTokens?: boolean;
  roe: number;
  itemName?: string;
  results: ResultsData;
} & ResultsProps;

const UnWrapResults: React.FC<UnWrapResultsProps> = props => {
  const {
    results: {
      receivingAddress,
      chainCode,
      publicAddress,
      amount,
      fioDomain,
      other: { transaction_id },
    },
    itemName = 'tokens',
    isTokens = false,
  } = props;

  const fioAmount = Number(amount);

  const displayAmount = (
    <>
      <Amount value={fioAmount.toFixed(2)} /> {FIO_CHAIN_CODE}
    </>
  );
  const displayUsdcAmount = (
    <>
      <ConvertedAmount fioAmount={fioAmount} />
    </>
  );

  return (
    <Results {...props} isPaymentDetailsVisible={false}>
      <InfoBadge
        show={true}
        type={BADGE_TYPES.INFO}
        title="Submitted"
        message={
          <>
            Your FIO {itemName} has been submitted for unwrapping. Completion
            time for this transaction can vary and your {itemName} will not be
            immediately available in your wallet. <br /> Please check the{' '}
            <a
              href={`${process.env.REACT_APP_WRAP_STATUS_PAGE_BASE_URL}${
                isTokens
                  ? ROUTES.WRAP_STATUS_UNWRAP_TOKENS
                  : ROUTES.WRAP_STATUS_UNWRAP_DOMAINS
              }`}
              target="_blank"
              rel="noreferrer"
            >
              <span className={classnames(classes.white, classes.boldMessage)}>
                status page
              </span>
            </a>{' '}
            for transaction progress.
          </>
        }
      />
      <p className={classes.label}>Transaction Details</p>
      <Badge show={!!chainCode} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Unwrap Chain</p>
          <p className={classes.item}>{chainCode}</p>
        </div>
      </Badge>
      <Badge show={!!publicAddress} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Public Address</p>
          <p className={classes.item}>{publicAddress}</p>
        </div>
      </Badge>
      <Badge show={!!receivingAddress} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Receiving Address</p>
          <p className={classes.item}>{receivingAddress}</p>
        </div>
      </Badge>

      <Badge show={!!amount} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>FIO Unwrapped</p>
          <p className={classes.item}>
            {displayUsdcAmount} ({displayAmount})
          </p>
        </div>
      </Badge>
      <Badge show={!!fioDomain} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Fio Domain Unwrapped</p>
          <p className={classes.item}>{fioDomain}</p>
        </div>
      </Badge>
      <Badge show={!!transaction_id} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>ID</p>
          <p className={classnames(classes.item, classes.isIndigo)}>
            <a
              href={`${
                isTokens
                  ? process.env.REACT_APP_ETH_HISTORY_URL
                  : process.env.REACT_APP_POLYGON_HISTORY_URL
              }${transaction_id as string}`}
              target="_blank"
              rel="noreferrer"
            >
              {transaction_id}
            </a>
          </p>
        </div>
      </Badge>
    </Results>
  );
};

export default UnWrapResults;

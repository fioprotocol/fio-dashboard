import React from 'react';
import classnames from 'classnames';

import Results from '../index';
import { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';
import Amount from '../../Amount';

import { removeTrailingSlashFromUrl } from '../../../../util/general';

import { FIO_CHAIN_CODE } from '../../../../constants/fio';
import { ROUTES } from '../../../../constants/routes';
import config from '../../../../config';

import { ResultsProps } from '../types';
import { AnyObject } from '../../../../types';

import { ResultDetails } from '../../../ResultDetails/ResultDetails';
import { TransactionDetails } from '../../../TransactionDetails/TransactionDetails';

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
              href={`${removeTrailingSlashFromUrl(config.wrapStatusPage)}${
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

      <ResultDetails
        show={!!publicAddress}
        label="Public Address"
        value={publicAddress}
      />

      <ResultDetails
        show={!!receivingAddress}
        label="Receiving Address"
        value={receivingAddress}
      />

      <ResultDetails
        show={!!amount}
        label="FIO Unwrapped"
        value={
          <>
            {displayUsdcAmount} ({displayAmount})
          </>
        }
      />

      <ResultDetails
        show={!!fioDomain}
        label="Fio Domain Unwrapped"
        value={fioDomain}
      />

      <p className={classes.label}>Transaction Details</p>
      <TransactionDetails
        additional={[
          {
            label: 'Unwrap Chain',
            value: chainCode,
          },
          {
            label: 'ID',
            value: transaction_id,
            wrap: true,
            link: `${
              isTokens
                ? process.env.REACT_APP_ETH_HISTORY_URL
                : process.env.REACT_APP_POLYGON_HISTORY_URL
            }${transaction_id as string}`,
          },
        ]}
      />
    </Results>
  );
};

export default UnWrapResults;

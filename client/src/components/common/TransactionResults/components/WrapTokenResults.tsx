import React from 'react';
import classnames from 'classnames';

import Results from '../index';
import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';
import Amount from '../../Amount';

import { removeTrailingSlashFromUrl } from '../../../../util/general';

import { FIO_CHAIN_CODE } from '../../../../constants/fio';
import { ROUTES } from '../../../../constants/routes';
import config from '../../../../config';

import { ResultsProps } from '../types';
import { AnyType } from '../../../../types';

import classes from '../styles/Results.module.scss';
import { TransactionDetails } from '../../../TransactionDetails/TransactionDetails';

type ResultsData = {
  amount?: string;
  name?: string;
  chainCode: string;
  block_num?: number;
  publicAddress: string;
  nativeFeeCollectedAmount: number;
  other?: { transaction_id?: string } & AnyType;
  error?: string | null;
};

type WrapTokenResultsProps = {
  roe: number;
  results: ResultsData;
} & ResultsProps;

const WrapTokenResults: React.FC<WrapTokenResultsProps> = props => {
  const {
    results: {
      name,
      chainCode,
      publicAddress,
      nativeFeeCollectedAmount,
      amount,
      other: { transaction_id },
    },
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
            Your FIO {name ? 'domain' : 'tokens'} has been submitted for
            wrapping. Completion time for this transaction can vary and your{' '}
            {name ? 'domain' : 'tokens'} will not be immediately available in
            your wallet. <br /> Please check the{' '}
            <a
              href={`${removeTrailingSlashFromUrl(config.wrapStatusPage)}${
                name
                  ? ROUTES.WRAP_STATUS_WRAP_DOMAINS
                  : ROUTES.WRAP_STATUS_WRAP_TOKENS
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
      {publicAddress && (
        <>
          <p className={classes.label}>Public Address</p>
          <Badge show type={BADGE_TYPES.SIMPLE}>
            <div className={classnames(classes.badgeContainer)}>
              <p className={classes.item}>{publicAddress}</p>
            </div>
          </Badge>
        </>
      )}

      {name && (
        <>
          <p className={classes.label}>Domain Wrapped</p>
          <Badge show type={BADGE_TYPES.SIMPLE}>
            <div className={classnames(classes.badgeContainer)}>
              <p className={classes.item}>{name}</p>
            </div>
          </Badge>
        </>
      )}
      {amount && (
        <>
          <p className={classes.label}>FIO Wrapped</p>
          <Badge show type={BADGE_TYPES.SIMPLE}>
            <div className={classnames(classes.badgeContainer)}>
              <p className={classes.item}>
                {displayUsdcAmount} ({displayAmount})
              </p>
            </div>
          </Badge>
        </>
      )}
      <p className={classes.label}>Transaction Details</p>
      <TransactionDetails
        feeInFio={nativeFeeCollectedAmount}
        additional={[
          {
            label: 'Wrap Chain',
            value: chainCode,
          },
          {
            label: 'ID',
            value: transaction_id,
            wrap: true,
            link: `${
              process.env.REACT_APP_FIO_BLOCKS_TX_URL
            }${transaction_id as string}`,
          },
        ]}
      />
    </Results>
  );
};

export default WrapTokenResults;

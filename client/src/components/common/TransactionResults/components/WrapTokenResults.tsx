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

type ResultsData = {
  amount?: string;
  name?: string;
  chainCode: string;
  block_num?: number;
  publicAddress: string;
  feeCollectedAmount: number;
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
      feeCollectedAmount,
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

  const displayFeesAmount = (
    <>
      <Amount value={feeCollectedAmount.toFixed(2)} /> {FIO_CHAIN_CODE}
    </>
  );
  const displayUsdcFeesAmount = (
    <>
      <ConvertedAmount
        fioAmount={feeCollectedAmount}
        nativeAmount={nativeFeeCollectedAmount}
      />
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
      <p className={classes.label}>Transaction Details</p>
      <Badge show={!!chainCode} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Wrap Chain</p>
          <p className={classes.item}>{chainCode}</p>
        </div>
      </Badge>
      <Badge show={!!publicAddress} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Public Address</p>
          <p className={classes.item}>{publicAddress}</p>
        </div>
      </Badge>
      <Badge show={!!name} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Domain Wrapped</p>
          <p className={classes.item}>{name}</p>
        </div>
      </Badge>

      <Badge show={!!amount} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>FIO Wrapped</p>
          <p className={classes.item}>
            {displayUsdcAmount} ({displayAmount})
          </p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Fees</p>
          <p className={classes.item}>
            {displayUsdcFeesAmount} ({displayFeesAmount})
          </p>
        </div>
      </Badge>
      <Badge show={!!transaction_id} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>ID</p>
          <p className={classnames(classes.item, classes.isIndigo)}>
            <a
              href={`${
                process.env.REACT_APP_FIO_BLOCKS_TX_URL
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

export default WrapTokenResults;

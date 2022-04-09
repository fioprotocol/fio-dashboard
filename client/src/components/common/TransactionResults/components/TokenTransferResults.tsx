import React from 'react';
import classnames from 'classnames';

import Results from '../index';
import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';

import { ResultsProps } from '../types';

import classes from '../styles/Results.module.scss';
import { FIO_CHAIN_CODE } from '../../../../constants/fio';
import Amount from '../../Amount';

type TokenTransferResultsProps = ResultsProps & {
  roe: number;
  mapError?: boolean;
};

const TokenTransferResults: React.FC<TokenTransferResultsProps> = props => {
  const {
    results: {
      other: {
        to,
        toFioAddress,
        from,
        fromFioAddress,
        amount,
        nativeAmount,
        tokenCode,
        transaction_id,
        memo,
        obtError,
        fioRequestId,
        mapError,
        mapPubAddress,
        payeeTokenPublicAddress,
      },
    },
    titleTo,
    titleFrom,
    titleAmount,
  } = props;

  const fioAmount = Number(amount);
  let displayAmount = (
    <>
      <Amount value={fioAmount.toFixed(2)} /> {tokenCode}
    </>
  );
  let displayUsdcAmount;
  if (tokenCode === FIO_CHAIN_CODE || tokenCode == null) {
    displayAmount = (
      <>
        <Amount value={fioAmount.toFixed(2)} /> {FIO_CHAIN_CODE}
      </>
    );
    displayUsdcAmount = (
      <>
        / <ConvertedAmount fioAmount={fioAmount} nativeAmount={nativeAmount} />
      </>
    );
  }
  return (
    <Results {...props}>
      <InfoBadge
        show={!!obtError}
        type={BADGE_TYPES.ERROR}
        title="Error!"
        message={
          fioRequestId
            ? 'Tokens have been sent but FIO Request record failed'
            : 'Memo failed to send'
        }
      />
      <InfoBadge
        show={mapError != null}
        type={BADGE_TYPES.ERROR}
        title="Error!"
        message="FIO Request have been sent but address map failed"
      />
      <p className={classes.label}>Transfer Information</p>
      <Badge show={!!from} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Sending FIO Public Key</p>
          <p className={classes.item}>{from}</p>
        </div>
      </Badge>
      <Badge show={!!fromFioAddress} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>
            {titleFrom || 'Sending FIO Crypto Handle'}
          </p>
          <p className={classes.item}>{fromFioAddress}</p>
        </div>
      </Badge>
      <Badge show={!!to} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Send to FIO Public Key</p>
          <p className={classes.item}>{to}</p>
        </div>
      </Badge>
      <Badge show={!!toFioAddress} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>
            {titleTo || 'Send to FIO Crypto Handle'}
          </p>
          <p className={classes.item}>{toFioAddress}</p>
        </div>
      </Badge>

      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>{titleAmount || 'Amount Sent'}</p>
          <p className={classes.item}>
            {displayAmount} {displayUsdcAmount}
          </p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>ID</p>
          <p className={classnames(classes.item, classes.isBlue)}>
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
      <Badge show={!!memo} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>Memo</p>
          <p className={classes.item}>{memo}</p>
        </div>
      </Badge>

      <InfoBadge
        show={
          !!mapPubAddress && mapError == null && payeeTokenPublicAddress != null
        }
        type={BADGE_TYPES.INFO}
        title="Public address mapped!"
        message={`'${payeeTokenPublicAddress as string}' was mapped to ${fromFioAddress as string}`}
      />
    </Results>
  );
};

export default TokenTransferResults;

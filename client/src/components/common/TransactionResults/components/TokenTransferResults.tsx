import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import Results from '../index';

import apis from '../../../../api';

import { ResultsProps } from '../types';

import classes from '../styles/Results.module.scss';

type TokenTransferResultsProps = ResultsProps & { roe: number; mapError?: any };

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
        transaction_id,
        memo,
        obtError,
        fioRequestId,
        mapError,
        mapPubAddress,
        payeeTokenPublicAddress,
      },
    },
    roe,
    titleTo,
    titleFrom,
    titleAmount,
  } = props;

  const fioAmount = Number(amount);
  const usdcAmount = apis.fio.convertFioToUsdc(Number(nativeAmount), roe);
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
      {from != null && (
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div
            className={classnames(classes.badgeContainer, classes.longTitle)}
          >
            <p className={classes.title}>Sending FIO Public Key</p>
            <p className={classes.item}>{from}</p>
          </div>
        </Badge>
      )}
      {fromFioAddress != null && (
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div
            className={classnames(classes.badgeContainer, classes.longTitle)}
          >
            <p className={classes.title}>
              {titleFrom || 'Sending FIO Crypto Handle'}
            </p>
            <p className={classes.item}>{fromFioAddress}</p>
          </div>
        </Badge>
      )}
      {to != null && (
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div
            className={classnames(classes.badgeContainer, classes.longTitle)}
          >
            <p className={classes.title}>Send to FIO Public Key</p>
            <p className={classes.item}>{to}</p>
          </div>
        </Badge>
      )}
      {toFioAddress != null && (
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div
            className={classnames(classes.badgeContainer, classes.longTitle)}
          >
            <p className={classes.title}>
              {titleTo || 'Send to FIO Crypto Handle'}
            </p>
            <p className={classes.item}>{toFioAddress}</p>
          </div>
        </Badge>
      )}

      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>{titleAmount || 'Amount Sent'}</p>
          <p className={classes.item}>
            {fioAmount.toFixed(2)} FIO / {usdcAmount.toFixed(2)} USDC
          </p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.longTitle)}>
          <p className={classes.title}>ID</p>
          <p className={classnames(classes.item, classes.isBlue)}>
            <a
              href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${transaction_id}`}
              target="_blank"
              rel="noreferrer"
            >
              {transaction_id}
            </a>
          </p>
        </div>
      </Badge>
      {memo && (
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div
            className={classnames(classes.badgeContainer, classes.longTitle)}
          >
            <p className={classes.title}>Memo</p>
            <p className={classes.item}>{memo}</p>
          </div>
        </Badge>
      )}

      <InfoBadge
        show={
          mapPubAddress != null &&
          mapPubAddress &&
          mapError == null &&
          payeeTokenPublicAddress != null
        }
        type={BADGE_TYPES.INFO}
        title="Public address mapped!"
        message={`'${payeeTokenPublicAddress}' was mapped to ${fromFioAddress}`}
      />
    </Results>
  );
};

export default TokenTransferResults;

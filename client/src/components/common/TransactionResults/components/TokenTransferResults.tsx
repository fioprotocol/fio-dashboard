import React from 'react';

import Results from '../index';
import { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import ConvertedAmount from '../../../ConvertedAmount/ConvertedAmount';

import { ResultsProps } from '../types';

import { FIO_CHAIN_CODE } from '../../../../constants/fio';
import Amount from '../../Amount';
import { ResultDetails } from '../../../ResultDetails/ResultDetails';

import classes from '../styles/Results.module.scss';

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
        <ConvertedAmount fioAmount={fioAmount} nativeAmount={nativeAmount} />
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

      <ResultDetails
        show={!!from}
        label="Sending FIO Public Key"
        value={from}
      />

      <ResultDetails
        show={!!fromFioAddress}
        label={titleFrom || 'Sending FIO Handle'}
        value={fromFioAddress}
      />

      <ResultDetails
        show={!!to}
        label={titleFrom || 'Send to FIO Public Key'}
        value={to}
      />

      <ResultDetails
        show={!!toFioAddress}
        label={titleTo || 'Send to FIO Handle'}
        value={toFioAddress}
      />

      <ResultDetails
        label={titleAmount || 'Amount Sent'}
        value={
          <>
            {displayUsdcAmount} ({displayAmount})
          </>
        }
      />

      <ResultDetails
        show={!!toFioAddress}
        label={titleTo || 'Send to FIO Handle'}
        value={toFioAddress}
      />

      <ResultDetails
        label="ID"
        value={
          <a
            href={`${
              process.env.REACT_APP_FIO_BLOCKS_TX_URL
            }${transaction_id as string}`}
            target="_blank"
            rel="noreferrer"
          >
            {transaction_id}
          </a>
        }
      />

      <ResultDetails show={!!memo} label="Memo" value={memo} />

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

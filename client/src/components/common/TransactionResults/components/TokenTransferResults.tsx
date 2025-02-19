import React from 'react';

import Results from '../index';
import { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import { ResultDetails } from '../../../ResultDetails/ResultDetails';
import { TransactionDetails } from '../../../TransactionDetails/TransactionDetails';
import { PriceComponent } from '../../../PriceComponent';

import { useConvertFioToUsdc } from '../../../../util/hooks';

import { ResultsProps } from '../types';
import { Roe } from '../../../../types';

import classes from '../styles/Results.module.scss';

type TokenTransferResultsProps = ResultsProps & {
  roe: Roe;
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
        amount: fioAmount,
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
      bundlesCollected,
      feeCollected,
      payWith,
    },
    titleTo,
    titleFrom,
    titleAmount,
  } = props;

  const usdcPrice = useConvertFioToUsdc({ fioAmount });

  return (
    <Results {...props} isPaymentDetailsVisible={false}>
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
        label="Sending FIO Public Address"
        value={from}
      />

      <ResultDetails
        show={!!fromFioAddress}
        label={titleFrom || 'Sending FIO Handle'}
        value={fromFioAddress}
      />

      <ResultDetails
        show={!!to}
        label={titleFrom || 'Send to FIO Public Address'}
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
          <PriceComponent
            className={classes.priceValue}
            costFio={fioAmount}
            costUsdc={usdcPrice}
            tokenCode={tokenCode}
          />
        }
      />

      <ResultDetails show={!!memo} label="Memo" value={memo} />

      <p className={classes.label}>Transaction Details</p>
      <TransactionDetails
        feeInFio={feeCollected?.nativeFio ? feeCollected.nativeFio : null}
        amountInFio={nativeAmount}
        bundles={bundlesCollected ? { fee: bundlesCollected } : null}
        payWith={payWith}
        additional={[
          {
            label: 'ID',
            value: transaction_id,
            link: `${
              process.env.REACT_APP_FIO_BLOCKS_TX_URL
            }${transaction_id as string}`,
            wrap: true,
          },
        ]}
      />

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

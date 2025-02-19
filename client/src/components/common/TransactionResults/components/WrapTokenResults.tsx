import classnames from 'classnames';

import { FC } from 'react';

import Results from '../index';
import { BADGE_TYPES } from '../../../Badge/Badge';
import InfoBadge from '../../../InfoBadge/InfoBadge';

import { removeTrailingSlashFromUrl } from '../../../../util/general';
import MathOp from '../../../../util/math';

import { ROUTES } from '../../../../constants/routes';
import config from '../../../../config';

import { ResultsProps } from '../types';
import { AnyType, Roe } from '../../../../types';

import { TransactionDetails } from '../../../TransactionDetails/TransactionDetails';
import { ResultDetails } from '../../../ResultDetails/ResultDetails';
import { PriceComponent } from '../../../PriceComponent';

import { useConvertFioToUsdc } from '../../../../util/hooks';

import classes from '../styles/Results.module.scss';

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
  roe: Roe;
  results: ResultsData;
} & ResultsProps;

const WrapTokenResults: FC<WrapTokenResultsProps> = props => {
  const {
    results: {
      name,
      chainCode,
      publicAddress,
      nativeFeeCollectedAmount,
      amount: fioAmount,
      other: { transaction_id },
    },
  } = props;

  const usdcPrice = useConvertFioToUsdc({ fioAmount });

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

      <ResultDetails
        show={!!publicAddress}
        label="Public Address"
        value={publicAddress}
      />

      <ResultDetails show={!!name} label="Domain Wrapped" value={name} />

      <ResultDetails
        show={fioAmount && new MathOp(fioAmount).gt(0)}
        label="FIO Wrapped"
        value={
          <PriceComponent
            className={classes.priceValue}
            costFio={fioAmount}
            costUsdc={usdcPrice}
          />
        }
      />

      <p className={classes.label}>Transaction Details</p>
      <TransactionDetails
        feeInFio={new MathOp(nativeFeeCollectedAmount).toString()}
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

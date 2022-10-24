import React from 'react';
import classnames from 'classnames';

import Amount from '../../common/Amount';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { CURRENCY_CODES } from '../../../constants/common';

import { PaymentCurrency } from '../../../types';

import classes from './PriceBadge.module.scss';

type TotalAmountProps = {
  paymentAmount: number | string;
  paymentCurrency: string;
};

export type Props = {
  costFree?: string;
  type: string;
  title: string;
  paymentAmount: number | string;
  paymentCurrency?: PaymentCurrency;
  convertedPaymentAmount?: number | string;
  convertedPaymentCurrency?: string;
};

const TotalAmount: React.FC<TotalAmountProps> = props => {
  const { paymentAmount, paymentCurrency } = props;

  if (paymentCurrency?.toUpperCase() === CURRENCY_CODES.USD)
    return (
      <>
        $<Amount value={paymentAmount} />
      </>
    );

  return (
    <>
      <Amount value={paymentAmount} /> {paymentCurrency}
    </>
  );
};

const TotalPriceAmount: React.FC<Props> = props => {
  const {
    costFree,
    paymentAmount,
    paymentCurrency = CURRENCY_CODES.FIO,
    convertedPaymentAmount,
    convertedPaymentCurrency = CURRENCY_CODES.USDC,
  } = props;

  if (costFree) return <>{costFree}</>;

  return (
    <>
      <TotalAmount
        paymentAmount={paymentAmount}
        paymentCurrency={paymentCurrency}
      />
      {convertedPaymentAmount && (
        <>
          {' / '}
          <TotalAmount
            paymentAmount={convertedPaymentAmount}
            paymentCurrency={convertedPaymentCurrency}
          />
        </>
      )}
    </>
  );
};

const PriceBadge: React.FC<Props> = props => {
  const { title, type } = props;

  const hasWhiteText = type === BADGE_TYPES.BLACK || type === BADGE_TYPES.ERROR;

  return (
    <Badge type={type} show>
      <div
        className={classnames(
          classes.item,
          hasWhiteText && classes.hasWhiteText,
        )}
      >
        {title && (
          <span className={classnames(classes.name, 'boldText')}>{title}</span>
        )}
        <p className={classes.totalPrice}>
          <span className="boldText">
            <TotalPriceAmount {...props} />
          </span>
        </p>
      </div>
    </Badge>
  );
};

export default PriceBadge;

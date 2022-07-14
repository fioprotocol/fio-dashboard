import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import PriceBadge from '../../../components/Badges/PriceBadge/PriceBadge';
import CartItem from '../../../components/Cart/CartItem';

import { PURCHASE_PROVIDER_LABEL } from '../../../constants/purchase';

import { PurchaseResultsProps } from '../types';

import classes from '../styles/PurchasePage.module.scss';

export const PurchaseResultsComponent: React.FC<PurchaseResultsProps> = props => {
  const {
    paymentAmount,
    paymentCurrency,
    convertedPaymentAmount,
    convertedPaymentCurrency,
    costFree,
    priceUIType = BADGE_TYPES.BLACK,
    priceTitle = 'Total Cost',
    providerTxId,
    purchaseProvider,
    txItems,
    failedPayment,
    hidePayWithBadge,
  } = props;

  return (
    <>
      <h6 className={classes.subtitle}>Transaction Details</h6>
      {txItems.map(item => (
        <CartItem item={item} key={item.id} />
      ))}
      <PriceBadge
        paymentAmount={paymentAmount}
        paymentCurrency={paymentCurrency}
        convertedPaymentAmount={convertedPaymentAmount}
        convertedPaymentCurrency={convertedPaymentCurrency}
        costFree={costFree}
        title={priceTitle}
        type={priceUIType}
      />
      <Badge type={BADGE_TYPES.WHITE} show={!hidePayWithBadge}>
        <div className={classes.item}>
          <span className={classnames(classes.name, 'boldText')}>
            Paid With
          </span>
          <p className={classes.itemValue}>
            <span className="boldText">
              {failedPayment
                ? 'Not Paid'
                : PURCHASE_PROVIDER_LABEL[purchaseProvider]}
            </span>
          </p>
        </div>
      </Badge>
      <Badge type={BADGE_TYPES.WHITE} show={!!providerTxId}>
        <div className={classes.item}>
          <span className={classnames(classes.name, 'boldText')}>
            Transaction ID
          </span>
          <p className={classes.itemValue}>
            <span className="boldText">{providerTxId}</span>
          </p>
        </div>
      </Badge>
    </>
  );
};

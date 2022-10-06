import React from 'react';

import { InfoBadgeComponent } from './InfoBadgeComponent';
import { PurchaseResultsComponent } from './PurchaseResultsComponent';

import { PURCHASE_RESULTS_STATUS } from '../../../constants/purchase';

import { RegisteredResultsComponentProps } from '../types';

import classes from '../styles/PurchasePage.module.scss';

export const RegisteredResultsComponent: React.FC<RegisteredResultsComponentProps> = props => {
  const {
    paymentWallet,
    purchaseStatus,
    paymentProvider,
    txItems,
    paymentAmount,
    paymentCurrency,
    convertedPaymentAmount,
    convertedPaymentCurrency,
    costFree,
    providerTxId,
  } = props;

  return (
    <div className={classes.details}>
      {purchaseStatus === PURCHASE_RESULTS_STATUS.SUCCESS && (
        <h5 className={classes.completeTitle}>Purchases Completed</h5>
      )}
      <InfoBadgeComponent
        purchaseStatus={purchaseStatus}
        paymentProvider={paymentProvider}
        hide={purchaseStatus === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS}
      />
      <PurchaseResultsComponent
        paymentWallet={paymentWallet}
        txItems={txItems}
        paymentAmount={paymentAmount}
        paymentCurrency={paymentCurrency}
        convertedPaymentAmount={convertedPaymentAmount}
        convertedPaymentCurrency={convertedPaymentCurrency}
        costFree={costFree}
        providerTxId={providerTxId}
        paymentProvider={paymentProvider}
      />
    </div>
  );
};

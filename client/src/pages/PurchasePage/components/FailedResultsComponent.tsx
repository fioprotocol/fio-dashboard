import React from 'react';
import classnames from 'classnames';

import { BADGE_TYPES } from '../../../components/Badge/Badge';

import { InfoBadgeComponent } from './InfoBadgeComponent';
import { PurchaseResultsComponent } from './PurchaseResultsComponent';

import { PURCHASE_RESULTS_STATUS } from '../../../constants/purchase';

import { FailedResultsComponentProps } from '../types';

import classes from '../styles/PurchasePage.module.scss';

export const FailedResultsComponent: React.FC<FailedResultsComponentProps> = props => {
  const {
    paymentWallet,
    purchaseStatus,
    purchaseProvider,
    txItems,
    errorBadges,
    paymentAmount,
    paymentCurrency,
    convertedPaymentAmount,
    convertedPaymentCurrency,
    costFree,
    providerTxId,
    allErrored,
  } = props;

  if (purchaseStatus === PURCHASE_RESULTS_STATUS.CANCELED)
    return (
      <>
        <InfoBadgeComponent
          purchaseStatus={purchaseStatus}
          purchaseProvider={purchaseProvider}
        />
        <div className={classes.details}>
          <PurchaseResultsComponent
            paymentWallet={paymentWallet}
            txItems={txItems}
            paymentAmount={paymentAmount}
            paymentCurrency={paymentCurrency}
            convertedPaymentAmount={convertedPaymentAmount}
            convertedPaymentCurrency={convertedPaymentCurrency}
            costFree={costFree}
            providerTxId={providerTxId}
            purchaseProvider={purchaseProvider}
          />
        </div>
      </>
    );

  return (
    <>
      {Object.values(errorBadges).map(({ errorType, total, totalCurrency }) => (
        <InfoBadgeComponent
          purchaseStatus={purchaseStatus}
          purchaseProvider={purchaseProvider}
          failedMessage={errorType}
          failedTxsTotalAmount={total}
          failedTxsTotalCurrency={totalCurrency}
        />
      ))}

      <div className={classes.details}>
        <h5
          className={classnames(
            classes.completeTitle,
            !allErrored && classes.second,
          )}
        >
          Purchases Not Completed
        </h5>
        <PurchaseResultsComponent
          paymentWallet={paymentWallet}
          txItems={txItems}
          paymentAmount={paymentAmount}
          paymentCurrency={paymentCurrency}
          convertedPaymentAmount={convertedPaymentAmount}
          convertedPaymentCurrency={convertedPaymentCurrency}
          costFree={costFree}
          providerTxId={providerTxId}
          purchaseProvider={purchaseProvider}
          priceUIType={
            purchaseStatus === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS
              ? BADGE_TYPES.ERROR
              : BADGE_TYPES.BLACK
          }
          priceTitle={
            !costFree && !allErrored ? 'Total Cost Remaining' : 'Total Cost'
          }
          failedPayment={true}
          hidePayWithBadge={!allErrored}
        />
      </div>
    </>
  );
};

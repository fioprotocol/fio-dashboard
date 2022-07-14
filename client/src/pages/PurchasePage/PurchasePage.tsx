import React from 'react';
import isEmpty from 'lodash/isEmpty';

import PseudoModalContainer from '../../components/PseudoModalContainer';

import Processing from '../../components/common/TransactionProcessing';

import { useContext } from './PurchasePageContext';
import { ActionButton } from './components/ActionButton';

import { RegisteredResultsComponent } from './components/RegisteredResultsComponent';
import { FailedResultsComponent } from './components/FailedResultsComponent';

import { PURCHASE_RESULTS_TITLES } from '../../constants/purchase';

import classes from './styles/PurchasePage.module.scss';

export const PurchasePage: React.FC = () => {
  const {
    regItems,
    errItems,
    closeText,
    onClose,
    onFinish,
    purchaseStatus,
    purchaseProvider,
    regPaymentAmount,
    regConvertedPaymentAmount,
    regCostFree,
    errPaymentAmount,
    errConvertedPaymentAmount,
    errCostFree,
    paymentCurrency,
    convertedPaymentCurrency,
    providerTxId,
    allErrored,
    failedTxsTotalAmount,
    isProcessing,
    isRetry,
  } = useContext();

  return (
    <PseudoModalContainer
      title={PURCHASE_RESULTS_TITLES[purchaseStatus].title}
      onClose={onClose}
    >
      <div className={classes.container}>
        {!isEmpty(regItems) && (
          <RegisteredResultsComponent
            purchaseStatus={purchaseStatus}
            purchaseProvider={purchaseProvider}
            txItems={regItems}
            paymentAmount={regPaymentAmount}
            paymentCurrency={paymentCurrency}
            convertedPaymentAmount={regConvertedPaymentAmount}
            convertedPaymentCurrency={convertedPaymentCurrency}
            costFree={regCostFree}
            providerTxId={providerTxId}
          />
        )}
        {!isEmpty(errItems) && (
          <FailedResultsComponent
            purchaseStatus={purchaseStatus}
            purchaseProvider={purchaseProvider}
            txItems={errItems}
            paymentAmount={errPaymentAmount}
            paymentCurrency={paymentCurrency}
            convertedPaymentAmount={errConvertedPaymentAmount}
            convertedPaymentCurrency={convertedPaymentCurrency}
            costFree={errCostFree}
            providerTxId={providerTxId}
            allErrored={allErrored}
            failedTxsTotalAmount={failedTxsTotalAmount}
          />
        )}
        <ActionButton
          onClose={onClose}
          closeText={closeText}
          isRetry={isRetry}
          onFinish={onFinish}
        />
      </div>
      <Processing isProcessing={isProcessing} />
    </PseudoModalContainer>
  );
};

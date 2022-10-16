import React from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import { InfoBadgeComponent } from './components/InfoBadgeComponent';
import { OrderDetailsContainer } from '../../components/OrderDetailsContainer';

import { OrderItemsList } from './components/OrderItemsList';
import { PaymentDetails } from './components/PaymentDetails';
import { PartialErroredOrderItemsList } from './components/PartialErroredOrderItemsList';

import { useContext } from './OrderDetailsPageContext';

import { OrderDetailsProps } from './types';
import { ContextProps } from '../../components/OrderDetailsContainer/OrderDetailsContainerContext';

import classes from './OrderDetailsPage.module.scss';

export const OrderDetails: React.FC<OrderDetailsProps> = props => {
  const {
    actionButtonProps,
    infoBadgeData,
    isAllErrored,
    isPartial,
    errorBadges,
    orderItemsToRender,
    paymentInfo,
    partialErrorItems,
    partialErrorTotalCost,
    title,
  } = useContext(props);

  return (
    <PseudoModalContainer title={title} onClose={actionButtonProps.onClick}>
      <div className={classes.container}>
        {isAllErrored && errorBadges ? (
          Object.values(
            errorBadges,
          ).map(({ errorType, total, totalCurrency }, i) => (
            <InfoBadgeComponent
              purchaseStatus={infoBadgeData.purchaseStatus}
              paymentProvider={infoBadgeData.paymentProvider}
              failedMessage={errorType}
              failedTxsTotalAmount={total}
              failedTxsTotalCurrency={totalCurrency}
              withoutTopMargin={i === 0}
              key={total + errorType}
            />
          ))
        ) : (
          <InfoBadgeComponent
            {...infoBadgeData}
            hide={isPartial}
            withoutTopMargin={true}
          />
        )}
        <OrderItemsList
          items={orderItemsToRender}
          primaryCurrency={paymentInfo?.paymentCurrency}
        />
        <PaymentDetails {...paymentInfo} />
        <PartialErroredOrderItemsList
          items={partialErrorItems}
          primaryCurrency={paymentInfo?.paymentCurrency}
          totalCostPrice={partialErrorTotalCost}
          infoBadgeData={infoBadgeData}
          errorBadges={errorBadges}
        />
        <SubmitButton {...actionButtonProps} />
      </div>
    </PseudoModalContainer>
  );
};

const OrderDetailsPage = () => (
  <OrderDetailsContainer>
    {(containerProps: ContextProps) => <OrderDetails {...containerProps} />}
  </OrderDetailsContainer>
);

export default OrderDetailsPage;

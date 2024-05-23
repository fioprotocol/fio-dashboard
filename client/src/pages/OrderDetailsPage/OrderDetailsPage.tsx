import React from 'react';
import { History } from 'history';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import { InfoBadgeComponent } from './components/InfoBadgeComponent';
import { OrderDetailsContainer } from '../../components/OrderDetailsContainer';

import { OrderItemsList } from './components/OrderItemsList';
import { PaymentDetails } from './components/PaymentDetails';
import { PartialErroredOrderItemsList } from './components/PartialErroredOrderItemsList';

import { useContext } from './OrderDetailsPageContext';

import { ROUTES } from '../../constants/routes';

import { OrderDetailsProps } from './types';
import { ContextProps } from '../../components/OrderDetailsContainer/OrderDetailsContainerContext';

import classes from './OrderDetailsPage.module.scss';

const actionClick = (history: History) => {
  history.push(ROUTES.ORDERS);
};

export const OrderDetails: React.FC<OrderDetailsProps> = props => {
  const {
    actionButtonProps,
    infoBadgeData,
    isAllErrored,
    isPartial,
    isRetryAvailable,
    errorBadges,
    orderItemsToRender,
    paymentInfo,
    partialErrorItems,
    partialErrorTotalCost,
    title,
    hideTopCloseButton,
  } = useContext(props);

  return (
    <PseudoModalContainer
      title={title}
      onClose={actionButtonProps.onClick}
      hideTopCloseButton={hideTopCloseButton}
    >
      <div className={classes.container}>
        {isAllErrored && errorBadges ? (
          Object.values(
            errorBadges,
          ).map(({ errorType, total, totalCurrency, items }, i) => (
            <InfoBadgeComponent
              isRetryAvailable={isRetryAvailable}
              purchaseStatus={infoBadgeData.purchaseStatus}
              paymentProvider={infoBadgeData.paymentProvider}
              failedMessage={errorType}
              failedTxsTotalAmount={total}
              failedTxsTotalCurrency={totalCurrency}
              withoutTopMargin={i === 0}
              key={items[0].id}
            />
          ))
        ) : (
          <InfoBadgeComponent
            {...infoBadgeData}
            hide={isPartial}
            withoutTopMargin={true}
          />
        )}
        <OrderItemsList items={orderItemsToRender} isEditable />
        <PaymentDetails {...paymentInfo} />
        <PartialErroredOrderItemsList
          isRetryAvailable={isRetryAvailable}
          items={partialErrorItems}
          totalCostPrice={partialErrorTotalCost}
          infoBadgeData={infoBadgeData}
          errorBadges={errorBadges}
        />
        <SubmitButton {...actionButtonProps} />
      </div>
    </PseudoModalContainer>
  );
};

const OrderDetailsPage = (props: { history: History }) => (
  <OrderDetailsContainer>
    {(containerProps: ContextProps) => (
      <OrderDetails
        {...containerProps}
        actionClick={() => actionClick(props.history)}
      />
    )}
  </OrderDetailsContainer>
);

export default OrderDetailsPage;

import React from 'react';

import Loader from '../../components/Loader/Loader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import { InfoBadgeComponent } from '../PurchasePage/components/InfoBadgeComponent';

import { OrderItemsList } from './components/OrderItemsList';
import { PaymentDetails } from './components/PaymentDetails';
import { PartialErroredOrderItemsList } from './components/PartialErroredOrderItemsList';

import { useContext } from './OrderDetailsPageContext';

import { OrderDetailsProps } from './types';

import classes from './OrderDetailsPage.module.scss';

const OrderDetailsPage: React.FC<OrderDetailsProps> = props => {
  const {
    actionButtonProps,
    infoBadgeData,
    isAllErrored,
    isPartial,
    errorBadges,
    loading,
    orderItemsToRender,
    paymentInfo,
    partialErrorItems,
    partialErrorTotalCost,
    title,
  } = useContext(props);

  if (loading) return <Loader />;

  return (
    <PseudoModalContainer title={title}>
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
              key={total}
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
          primaryCurrency={paymentInfo?.totalCost?.paymentCurrency}
        />
        <PaymentDetails {...paymentInfo} />
        <PartialErroredOrderItemsList
          items={partialErrorItems}
          primaryCurrency={paymentInfo?.totalCost?.paymentCurrency}
          totalCost={partialErrorTotalCost}
          infoBadgeData={infoBadgeData}
          errorBadges={errorBadges}
        />
        <SubmitButton {...actionButtonProps} />
      </div>
    </PseudoModalContainer>
  );
};

export default OrderDetailsPage;

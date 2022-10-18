import { useHistory } from 'react-router';

import { Title } from './components/Title';

import { combinePriceWithDivider } from '../../util/prices';

import { PaymentProvider } from '../../types';

import { ContextProps, OrderDetailsProps } from './types';

const DEFAULT_BUTTON_TEXT_VALUE = 'Close';

export const useContext = (props: OrderDetailsProps): ContextProps => {
  const history = useHistory<{ orderId: string }>();

  const defaultOnClick = () => history.goBack();

  const {
    buttonText = DEFAULT_BUTTON_TEXT_VALUE,
    actionClick = defaultOnClick,
    disabled,
    hideTopCloseButton,
    orderItem,
  } = props;

  const {
    errItems,
    regItems,
    number,
    payment,
    status,
    isAllErrored,
    isPartial,
    errorBadges,
  } = orderItem || {};
  const {
    paidWith,
    paymentProcessor,
    regTotalCost,
    errTotalCost,
    paymentCurrency,
  } = payment || {};

  const title = <Title orderStatus={status} />;

  let partialErrorItems = null;
  let partialErrorTotalCost = null;

  const regTotalCostPrice = combinePriceWithDivider({
    paymentProcessor,
    totalCostPrice: regTotalCost,
  });

  const errTotalCostPrice = combinePriceWithDivider({
    paymentProcessor,
    totalCostPrice: errTotalCost,
  });

  const infoBadgeData: {
    paymentProvider: PaymentProvider;
    purchaseStatus: number;
  } = {
    paymentProvider: paymentProcessor,
    purchaseStatus: status,
  };

  if (isPartial) {
    partialErrorItems = errItems;
    partialErrorTotalCost = errTotalCostPrice;
  }

  const orderItemsToRender = regItems?.length ? regItems : errItems;
  const totalCostPrice = regItems?.length
    ? regTotalCostPrice
    : errTotalCostPrice;

  const paymentInfo = {
    orderNumber: number,
    paidWith,
    totalCostPrice,
    paymentCurrency,
  };

  const actionButtonProps = {
    text: buttonText,
    onClick: actionClick,
    disabled,
  };

  return {
    actionButtonProps,
    infoBadgeData,
    isAllErrored,
    isPartial,
    hideTopCloseButton,
    orderItemsToRender,
    partialErrorItems,
    partialErrorTotalCost,
    errorBadges,
    title,
    paymentInfo,
  };
};

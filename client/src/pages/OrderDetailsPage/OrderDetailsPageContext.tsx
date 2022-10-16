import { useHistory } from 'react-router';

import { Title } from './components/Title';

import MathOp from '../../util/math';

import { combinePriceWithDivider } from '../../util/prices';

import { CURRENCY_CODES } from '../../constants/common';
import { PAYMENT_PROVIDER } from '../../constants/purchase';

import { PaymentProvider } from '../../types';

import { ContextProps, ErrBadgesProps, OrderDetailsProps } from './types';

const DEFAULT_BUTTON_TEXT_VALUE = 'Close';

const ERROR_CODES = {
  SINGED_TX_XTOKENS_REFUND_SKIP: 'SINGED_TX_XTOKENS_REFUND_SKIP',
};

export const useContext = (props: OrderDetailsProps): ContextProps => {
  const history = useHistory<{ orderId: string }>();

  const defaultOnClick = () => history.goBack();

  const {
    buttonText = DEFAULT_BUTTON_TEXT_VALUE,
    actionClick = defaultOnClick,
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

  const errorBadges: ErrBadgesProps = errItems
    ? errItems.reduce((acc, errItem) => {
        const { errorType, errorData } = errItem;
        let badgeKey: string = '';
        let totalCurrency: string;
        let customItemAmount: number = null;

        if (
          errorData &&
          errorData.code === ERROR_CODES.SINGED_TX_XTOKENS_REFUND_SKIP
        ) {
          badgeKey = `${errorData.code}`;
          totalCurrency = CURRENCY_CODES.FIO;
          customItemAmount = errorData.credited
            ? new MathOp(errorData.credited).toNumber()
            : null;
        } else {
          badgeKey = `${errorType}`;
          totalCurrency =
            paymentProcessor === PAYMENT_PROVIDER.STRIPE
              ? CURRENCY_CODES.USDC
              : CURRENCY_CODES.FIO;
        }

        if (!acc[badgeKey])
          acc[badgeKey] = {
            errorType: badgeKey,
            items: [],
            total: '',
            totalCurrency: '',
          };

        acc[badgeKey].errorType = badgeKey;
        acc[badgeKey].items.push(
          customItemAmount
            ? { ...errItem, costNativeFio: customItemAmount }
            : errItem,
        );

        acc[badgeKey].total = errTotalCostPrice;
        acc[badgeKey].totalCurrency = totalCurrency;

        return acc;
      }, {} as ErrBadgesProps)
    : {};

  const actionButtonProps = {
    text: buttonText,
    onClick: actionClick,
  };

  return {
    actionButtonProps,
    infoBadgeData,
    isAllErrored,
    isPartial,
    orderItemsToRender,
    partialErrorItems,
    partialErrorTotalCost,
    errorBadges,
    title,
    paymentInfo,
  };
};

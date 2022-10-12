import { useState } from 'react';
import { useHistory } from 'react-router';

import { Title } from './components/Title';

import apis from '../../api';

import MathOp from '../../util/math';

import useEffectOnce from '../../hooks/general';
import { useWebsocket } from '../../hooks/websocket';

import { CURRENCY_CODES } from '../../constants/common';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';
import { WS_ENDPOINTS } from '../../constants/websocket';

import {
  PaymentCurrency,
  PaymentProvider,
  PurchaseTxStatus,
  RegistrationResult,
  OrderDetailed,
} from '../../types';

import {
  ContextProps,
  ErrBadgesProps,
  OrderDetailsProps,
  TotalCost,
} from './types';

const DEFAULT_BUTTON_TEXT_VALUE = 'Close';

const ERROR_CODES = {
  SINGED_TX_XTOKENS_REFUND_SKIP: 'SINGED_TX_XTOKENS_REFUND_SKIP',
};

const generateTotalCostObj = ({
  paymentCurrency,
  paymentProcessor,
  fioNativeTotal,
  usdcTotal,
}: {
  fioNativeTotal: number;
  usdcTotal: number;
  paymentCurrency: PaymentCurrency;
  paymentProcessor: PaymentProvider;
}): TotalCost => {
  let convertedPaymentAmount = null;
  let convertedPaymentCurrency = null;
  let paymentAmount = null;

  const costFree = usdcTotal === 0 ? 'FREE' : null;

  if (paymentProcessor === PAYMENT_PROVIDER.FIO) {
    paymentAmount = apis.fio.sufToAmount(fioNativeTotal).toFixed(2);

    convertedPaymentAmount = usdcTotal?.toFixed(2);
    convertedPaymentCurrency = CURRENCY_CODES.USDC;
  } else {
    paymentAmount = usdcTotal?.toFixed(2);
  }

  return {
    convertedPaymentAmount,
    convertedPaymentCurrency,
    costFree,
    paymentAmount,
    paymentCurrency,
  };
};

export const useContext = (props: OrderDetailsProps): ContextProps => {
  const history = useHistory<{ orderId: string }>();

  const defaultOnClick = () => history.goBack();

  const {
    buttonText = DEFAULT_BUTTON_TEXT_VALUE,
    actionClick = defaultOnClick,
  } = props;

  const {
    location: { state },
  } = history;
  const { orderId } = state || {};

  const [loading, toggleLoading] = useState<boolean>(false);
  const [orderItem, setOrderItem] = useState<OrderDetailed>(null);

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

  const getOrder = async () => {
    toggleLoading(true);
    const order = await apis.orders.get(orderId);
    setOrderItem(order);
    toggleLoading(false);
  };

  useEffectOnce(() => {
    getOrder();
  }, [getOrder]);

  const onStatusUpdate = (data: {
    orderStatus: PurchaseTxStatus;
    results?: RegistrationResult;
  }) => {
    if (data) {
      const { orderStatus } = data;
      if (
        orderStatus &&
        (orderStatus === PURCHASE_RESULTS_STATUS.SUCCESS ||
          orderStatus === PURCHASE_RESULTS_STATUS.FAILED ||
          orderStatus === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS ||
          orderStatus === PURCHASE_RESULTS_STATUS.CANCELED)
      ) {
        getOrder();
      }
    }
  };

  useWebsocket({
    endpoint: WS_ENDPOINTS.ORDER_STATUS,
    params: { orderId: Number(orderId) },
    onMessage: onStatusUpdate,
  });

  const title = <Title orderStatus={status} />;

  let partialErrorItems = null;
  let partialErrorTotalCost = null;

  const regTotalCostObj = generateTotalCostObj({
    paymentCurrency,
    paymentProcessor,
    ...regTotalCost,
  });

  const errTotalCostObj = generateTotalCostObj({
    paymentCurrency,
    paymentProcessor,
    ...errTotalCost,
  });

  const infoBadgeData: {
    failedTxsTotalAmount?: string;
    failedTxsTotalCurrency?: PaymentCurrency;
    paymentProvider: PaymentProvider;
    purchaseStatus: number;
  } = {
    failedTxsTotalAmount: null,
    failedTxsTotalCurrency: null,
    paymentProvider: paymentProcessor,
    purchaseStatus: status,
  };

  if (paymentProcessor !== PAYMENT_PROVIDER.FIO) {
    infoBadgeData.failedTxsTotalAmount = errTotalCostObj.paymentAmount;
    infoBadgeData.failedTxsTotalCurrency = errTotalCostObj.paymentCurrency;
  }

  if (isPartial) {
    partialErrorItems = errItems;
    partialErrorTotalCost = errTotalCostObj;
  }

  const orderItemsToRender = regItems?.length ? regItems : errItems;
  const totalCostObj = regItems?.length ? regTotalCostObj : errTotalCostObj;

  const paymentInfo = {
    orderNumber: number,
    paidWith,
    totalCost: totalCostObj,
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

        acc[badgeKey].total = errTotalCostObj.paymentAmount;
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
    loading,
    title,
    paymentInfo,
  };
};

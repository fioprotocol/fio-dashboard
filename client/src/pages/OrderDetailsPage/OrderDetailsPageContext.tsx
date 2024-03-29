import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { Title } from './components/Title';

import {
  ALREADY_REGISTERED_ERROR_TEXT,
  ERROR_TYPES,
} from '../../constants/errors';
import { ROUTES } from '../../constants/routes';

import { PaymentProvider, PaymentStatus } from '../../types';

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
    paymentStatus,
  } = payment || {};

  const title = <Title orderStatus={status} />;

  let partialErrorItems = null;
  let partialErrorTotalCost = null;

  const infoBadgeData: {
    paymentProvider: PaymentProvider;
    purchaseStatus: number;
    paymentStatus: PaymentStatus;
  } = {
    paymentProvider: paymentProcessor,
    purchaseStatus: status,
    paymentStatus,
  };

  if (isPartial) {
    partialErrorItems = errItems;
    partialErrorTotalCost = errTotalCost;
  }

  const orderItemsToRender = regItems?.length ? regItems : errItems;
  const totalCostPrice = regItems?.length ? regTotalCost : errTotalCost;

  const paymentInfo = {
    orderNumber: number,
    paidWith,
    totalCostPrice,
  };

  const actionButtonProps = {
    text: buttonText,
    onClick: actionClick,
    disabled,
  };

  const errorBadgesToShow = { ...errorBadges };
  if (errorBadges?.SINGED_TX_XTOKENS_REFUND_SKIP && errorBadges?.default) {
    // SINGED_TX_XTOKENS_REFUND_SKIP and default errors has the same error message. We want to show just one error instead 2.
    // In case if SINGED_TX_XTOKENS_REFUND_SKIP will have it's own message then remove this filtering.
    delete errorBadgesToShow.SINGED_TX_XTOKENS_REFUND_SKIP;
  }

  const isRetryAvailable =
    !isEmpty(errItems) &&
    errItems.filter(
      ({ errorType, error }) =>
        errorType !== ERROR_TYPES.userHasFreeAddress &&
        !error.includes(ALREADY_REGISTERED_ERROR_TEXT),
    ).length > 0 &&
    history?.location?.pathname === ROUTES.PURCHASE;

  return {
    actionButtonProps,
    infoBadgeData,
    isAllErrored,
    isPartial,
    isRetryAvailable,
    hideTopCloseButton,
    orderItemsToRender,
    partialErrorItems,
    partialErrorTotalCost,
    errorBadges: errorBadgesToShow,
    title,
    paymentInfo,
  };
};

import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { useSelector } from 'react-redux';

import { Title } from './components/Title';

import {
  ALREADY_REGISTERED_ERROR_TEXT,
  ERROR_TYPES,
} from '../../constants/errors';
import { ROUTES } from '../../constants/routes';
import { PAYMENT_PROVIDER } from '../../constants/purchase';

import {
  fioDomains as fioDomainsSelector,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';
import { isNoProfileFlow as isNoProfileFlowSelector } from '../../redux/refProfile/selectors';

import { groupCartItemsByPaymentWallet } from '../../util/cart';
import MathOp from '../../util/math';

import { PaymentProvider, PaymentStatus } from '../../types';

import { ContextProps, OrderDetailsProps, PaymentInfo } from './types';

const DEFAULT_BUTTON_TEXT_VALUE = 'Close';

export const useContext = (props: OrderDetailsProps): ContextProps => {
  const history = useHistory<{ orderId: string }>();
  const fioWallets = useSelector(fioWalletsSelector);
  const userDomains = useSelector(fioDomainsSelector);
  const isNoProfileFlow = useSelector(isNoProfileFlowSelector);

  const defaultOnClick = () => history.goBack();

  const {
    buttonText = DEFAULT_BUTTON_TEXT_VALUE,
    actionClick = defaultOnClick,
    disabled,
    hideTopCloseButton,
    orderItem,
  } = props;

  const {
    publicKey,
    errItems,
    regItems,
    number,
    payment,
    status,
    isAllErrored,
    isPartial,
    errorBadges,
    roe,
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

  const {
    groups: groupedCartItemsByPaymentWallet,
  } = groupCartItemsByPaymentWallet(
    publicKey,
    orderItemsToRender,
    fioWallets,
    userDomains,
  );

  const paymentInfo: PaymentInfo[] =
    paymentProcessor === PAYMENT_PROVIDER.FIO && !isNoProfileFlow
      ? groupedCartItemsByPaymentWallet.map(it => ({
          publicKey: it.signInFioWallet.publicKey,
          paidWith: it.signInFioWallet.name,
          totalFioNativeCostPrice: it.displayOrderItems.reduce(
            (total, it) =>
              new MathOp(total).add(it.fee_collected || 0).toString(),
            '0',
          ),
          orderNumber: number,
          roe,
        }))
      : [
          {
            publicKey: publicKey,
            paidWith,
            totalFioNativeCostPrice: totalCostPrice?.fioNativeTotal ?? '0',
            orderNumber: number,
            roe,
            isFree: true,
          },
        ];

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

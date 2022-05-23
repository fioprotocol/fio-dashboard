import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { RouteComponentProps } from 'react-router-dom';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderPurchase } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';

import {
  CONTAINED_FLOW_ACTIONS,
  CONTAINED_FLOW_ACTIONS_TO_ROUTES,
} from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { transformResult } from '../../util/fio';
import useEffectOnce from '../../hooks/general';

import {
  CartItem,
  Domain,
  Prices,
  ContainedFlowQueryParams,
  RegistrationResult,
} from '../../types';

const CONTINUE_TEXT = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]: 'Sign Your NFT',
};

type Props = {
  isAuthenticated: boolean;
  registrationResult: RegistrationResult;
  cartItems: CartItem[];
  prices: Prices;
  domains: Domain[];
  containedFlowQueryParams: ContainedFlowQueryParams;
  roe: number | null;
  recalculate: (cartItems: CartItem[]) => void;
};

const PurchasePage: React.FC<Props & RouteComponentProps> = props => {
  const {
    history,
    isAuthenticated,
    registrationResult,
    cartItems,
    prices,
    containedFlowQueryParams,
    roe,
    recalculate,
  } = props;

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const { registered, errors } = registrationResult || {};

  const hasErrors = !isEmpty(errors || []);

  const title = !isEmpty(registered) ? 'Purchased!' : 'Purchase Error!';

  const { regItems, errItems, updatedCart } = transformResult({
    result: registrationResult,
    cart: cartItems,
    prices,
    roe,
  });

  useEffectOnce(() => {
    recalculate(updatedCart);
  }, [recalculate, updatedCart]);

  const onClose = () => {
    if (containedFlowQueryParams != null && containedFlowQueryParams.action) {
      return history.push(
        CONTAINED_FLOW_ACTIONS_TO_ROUTES[containedFlowQueryParams.action],
      );
    }

    history.push(ROUTES.HOME);
  };

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <CheckoutPurchaseContainer
        isPurchase
        closeText={
          containedFlowQueryParams != null && containedFlowQueryParams.action
            ? CONTINUE_TEXT[containedFlowQueryParams.action]
            : null
        }
        history={history}
        onClose={onClose}
      >
        <RenderPurchase
          hasErrors={hasErrors}
          regItems={regItems}
          errItems={errItems}
          roe={roe}
        />
      </CheckoutPurchaseContainer>
    </PseudoModalContainer>
  );
};

export default PurchasePage;

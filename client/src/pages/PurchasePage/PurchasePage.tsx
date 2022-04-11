import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { RouteComponentProps } from 'react-router-dom';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderPurchase } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';

import { REF_ACTIONS, REF_ACTIONS_TO_ROUTES } from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { putParamsToUrl } from '../../utils';
import { transformResult } from '../../util/fio';
import useEffectOnce from '../../hooks/general';

import {
  CartItem,
  Domain,
  Prices,
  RefProfile,
  RefQueryParams,
  RegistrationResult,
} from '../../types';

const CONTINUE_TEXT = {
  [REF_ACTIONS.SIGNNFT]: 'Sign Your NFT',
};

type Props = {
  isAuthenticated: boolean;
  isRefFlow: boolean;
  registrationResult: RegistrationResult;
  cartItems: CartItem[];
  prices: Prices;
  domains: Domain[];
  refProfileQueryParams: RefQueryParams;
  refProfileInfo: RefProfile;
  roe: number | null;
  recalculate: (cartItems: CartItem[]) => void;
};

const PurchasePage: React.FC<Props & RouteComponentProps> = props => {
  const {
    history,
    isAuthenticated,
    isRefFlow,
    registrationResult,
    cartItems,
    prices,
    refProfileQueryParams,
    refProfileInfo,
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
    if (
      isRefFlow &&
      refProfileQueryParams != null &&
      refProfileQueryParams.action
    ) {
      return history.push(
        putParamsToUrl(REF_ACTIONS_TO_ROUTES[refProfileQueryParams.action], {
          refProfileCode: refProfileInfo.code,
        }),
      );
    }

    history.push(ROUTES.HOME);
  };

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <CheckoutPurchaseContainer
        isPurchase
        closeText={
          isRefFlow &&
          refProfileQueryParams != null &&
          refProfileQueryParams.action
            ? CONTINUE_TEXT[refProfileQueryParams.action]
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

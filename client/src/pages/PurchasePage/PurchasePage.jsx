import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderPurchase } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';
import { REF_ACTIONS, REF_ACTIONS_TO_ROUTES } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { putParamsToUrl } from '../../utils';
import { transformResult } from '../../util/fio';

const CONTINUE_TEXT = {
  [REF_ACTIONS.SIGNNFT]: 'Sign Your NFT',
};

const PurchasePage = props => {
  const {
    history,
    isAuthenticated,
    isRefFlow,
    registrationResult,
    cartItems,
    prices,
    recalculate,
    domains,
    refProfileQueryParams,
    refProfileInfo,
  } = props;

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuthenticated]);

  const { registered, errors } = registrationResult || {};

  const hasErrors = !isEmpty(errors || []);

  const title = !isEmpty(registered) ? 'Purchased!' : 'Purchase Error!';

  const { regItems, errItems, updatedCart } = transformResult({
    result: registrationResult,
    cart: cartItems,
    prices,
    recalculate,
    domains,
  });

  useEffect(() => {
    recalculate(updatedCart);
  }, []);

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
        onClose={onClose}
      >
        <RenderPurchase
          hasErrors={hasErrors}
          regItems={regItems}
          errItems={errItems}
        />
      </CheckoutPurchaseContainer>
    </PseudoModalContainer>
  );
};

export default PurchasePage;

import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderPurchase } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';
import { ROUTES } from '../../constants/routes';
import { transformResult } from '../../utils';

const PurchasePage = props => {
  const {
    history,
    isAuthenticated,
    registrationResult,
    cartItems,
    prices,
    recalculate,
    domains,
  } = props;

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES);
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
    history.push(ROUTES.DASHBOARD);
  };

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <CheckoutPurchaseContainer isPurchase>
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

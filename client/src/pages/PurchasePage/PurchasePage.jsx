import React, { useEffect } from 'react';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import Purchase from '../../components/Purchase';
import { ROUTES } from '../../constants/routes';

const PurchasePage = props => {
  const { cartItems, history, isAuthenticated, registrationResult } = props;

  const onClose = () => {
    history.push(ROUTES.DASHBOARD);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES);
    }
  }, [isAuthenticated]);

  const { registered, errors } = registrationResult || {};

  const title =
    errors && errors.length > 0 && registered && registered.length === 0
      ? 'Purchase Error!'
      : 'Purchased!';

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <Purchase cart={cartItems} isPurchase />
    </PseudoModalContainer>
  );
};

export default PurchasePage;

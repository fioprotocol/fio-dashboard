import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
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

  const { registered } = registrationResult || {};

  const title = !isEmpty(registered) ? 'Purchased!' : 'Purchase Error!';

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <Purchase cart={cartItems} isPurchase />
    </PseudoModalContainer>
  );
};

export default PurchasePage;

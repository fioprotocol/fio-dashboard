import React, { useEffect } from 'react';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import Purchase from '../../components/Purchase';
import { ROUTES } from '../../constants/routes';

const PurchasePage = props => {
  const { cartItems, history, isAuthenticated } = props;

  const onClose = () => {
    history.push(ROUTES.DASHBOARD);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES);
    }
  }, [isAuthenticated]);

  return (
    <PseudoModalContainer title="Purchased!" onClose={onClose}>
      <Purchase cart={cartItems} isPurchase />
    </PseudoModalContainer>
  );
};

export default PurchasePage;

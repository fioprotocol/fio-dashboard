import React from 'react';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import Purchase from '../../components/Purchase/Purchase';
import { ROUTES } from '../../constants/routes';

const PurchasePage = props => {
  const { cartItems, history } = props;

  const onClose = () => {
    history.push(ROUTES.DASHBOARD);
  };

  return (
    <PseudoModalContainer title="Purchased!" onClose={onClose}>
      <Purchase cart={cartItems} isPurchase />
    </PseudoModalContainer>
  );
};

export default PurchasePage;

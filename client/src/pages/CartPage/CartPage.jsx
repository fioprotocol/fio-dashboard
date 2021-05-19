import React, { useEffect, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';

import { ROUTES } from '../../constants/routes';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';

const CartPage = props => {
  const { cart, history } = props;

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevAmount = usePrevious({ cart });
  useEffect(() => {
    if (
      !isEmpty(cart) &&
      cart.length === 1 &&
      prevAmount &&
      prevAmount.cart.length === 1
    ) {
      history.push(ROUTES.CHECKOUT);
    }
  }, [prevAmount]);

  return (
    <DoubleCardContainer
      title="Your Cart"
      secondTitle="Amount Due"
      bigCart={<Cart {...props} />}
      smallCart={<CartAmount {...props} />}
    />
  );
};

export default CartPage;

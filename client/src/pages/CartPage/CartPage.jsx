import React, { useEffect, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';

import { ROUTES } from '../../constants/routes';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';
import { removeFreeCart, setFreeCart } from '../../utils';

const CartPage = props => {
  const {
    cart,
    history,
    fioWallets,
    recalculate,
    prices,
    account,
    domains,
  } = props;

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

  useEffect(async () => {
    if (fioWallets) {
      const userAddresses = [];
      for (const fioWallet of fioWallets) {
        const addresses = await fioWallet.otherMethods.getFioAddresses();
        if (addresses.length) userAddresses.push(addresses);
      }
      let retCart = [];
      if (userAddresses.length > 0) {
        retCart = removeFreeCart({ cart, prices });
      } else if (!cart.some(item => !item.costFio && !item.costUsdc)) {
        retCart = setFreeCart({ domains, cart });
      }
      recalculate(!isEmpty(retCart) ? retCart : cart);
    }
  }, [account]);

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

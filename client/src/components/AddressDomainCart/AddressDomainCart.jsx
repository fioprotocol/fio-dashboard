import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import CounterContainer from '../CounterContainer/CounterContainer';
import { ROUTES } from '../../constants/routes';
import colors from '../../assets/styles/colorsToJs.module.scss';
import { handleFreeAddressCart, deleteCartItem } from '../../utils';

import classes from './AddressDomainCart.module.scss';

const AddressDomainCart = props => {
  const {
    cartItems,
    deleteItem,
    account,
    domains,
    history,
    showLoginModal,
    fioWallets,
    prices,
    recalculate,
  } = props;
  const count = cartItems.length;
  const isCartEmpty = count === 0;

  const handleCheckout = () => {
    if (!account) {
      showLoginModal(ROUTES.CART);
      return;
    }
    const route = count === 1 ? ROUTES.CHECKOUT : ROUTES.CART;
    history.push(route);
  };

  const handleDeleteItem = id => {
    deleteCartItem({
      id,
      prices,
      deleteItem,
      cartItems,
      recalculate,
      domains,
    });
  };

  useEffect(async () => {
    await handleFreeAddressCart({
      domains,
      fioWallets,
      recalculate,
      cartItems,
      prices,
    });
  }, [account, domains, fioWallets]);

  return (
    <CartSmallContainer bgColor={colors['aqua-haze']}>
      <div className={classes.header}>
        <CounterContainer isEmpty={isCartEmpty}>{count}</CounterContainer>
        <h5 className={classes.title}>Cart</h5>
      </div>
      {isCartEmpty ? (
        <div className={classes.textContainer}>
          <h5 className={classes.textTitle}>Your Cart is Empty</h5>
          <p className={classes.text}>
            Add a FIO domain to start your journey in the world of
            interoperability
          </p>
        </div>
      ) : (
        <div>
          {!isEmpty(cartItems) &&
            cartItems.map(item => (
              <div key={item.id} className={classes.itemContainer}>
                <div className={classes.itemInfo}>
                  {item.address ? (
                    <p className={classes.itemName}>
                      <span className="boldText">{item.address}</span>
                      <span
                        className={
                          item.isCustomDomain ? 'boldText' : classes.thin
                        }
                      >
                        @{item.domain}
                      </span>
                    </p>
                  ) : (
                    <p className={classes.itemName}>
                      <span className="boldText">{item.domain}</span>
                    </p>
                  )}
                  <p className={classes.itemPrice}>
                    Cost:{' '}
                    <span className="boldText">
                      {!Number.isFinite(item.costFio) ||
                      !Number.isFinite(item.costUsdc)
                        ? 'FREE'
                        : `${item.costFio.toFixed(2)} FIO
                      (${item.costUsdc.toFixed(2)} USDC)`}
                    </span>{' '}
                    <span className={classes.thin}>- annually</span>
                  </p>
                </div>

                <FontAwesomeIcon
                  icon="trash"
                  className={classes.deleteIcon}
                  onClick={() => handleDeleteItem(item.id)}
                />
              </div>
            ))}
          <Button className={classes.button} onClick={handleCheckout}>
            <FontAwesomeIcon
              icon="shopping-cart"
              className={classes.cartIcon}
            />{' '}
            <p>Checkout now</p>
          </Button>
        </div>
      )}
    </CartSmallContainer>
  );
};

export default AddressDomainCart;

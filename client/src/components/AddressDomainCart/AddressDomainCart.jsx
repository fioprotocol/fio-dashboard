import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import CounterContainer from '../CounterContainer/CounterContainer';
import classes from './AddressDomainCart.module.scss';

const AddressDomainCart = props => {
  const {
    cartItems = [
      { domain: 'tester', cost: 2 },
      { address: 'test1', domain: 'tester1', cost: 42 },
    ],
  } = props;
  const count = cartItems.length;
  const isCartEmpty = count === 0;
  return (
    <CartSmallContainer>
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
          {cartItems.map(item => (
            <div key={item.cost} className={classes.itemContainer}>
              <div className={classes.itemInfo}>
                {item.address ? (
                  <p className={classes.itemName}>
                    <span className="boldText">{item.address}</span>
                    <span className={classes.thin}>@{item.domain}</span>
                  </p>
                ) : (
                  <p className={classes.itemName}>
                    <span className="boldText">{item.domain}</span>
                  </p>
                )}
                <p className={classes.itemPrice}>
                  Cost:{' '}
                  <span className="boldText">
                    {item.cost.toFixed(2)} USDC/{(item.cost / 0.31).toFixed(2)}{' '}
                    FIO
                  </span>{' '}
                  <span className={classes.thin}>(annually)</span>
                </p>
              </div>

              <FontAwesomeIcon icon="trash" className={classes.deleteIcon} />
            </div>
          ))}
          <Button className={classes.button}>
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

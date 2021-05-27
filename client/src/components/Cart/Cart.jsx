import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
import WalletDropdown from './WalletDropdown';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { recalculateCart } from '../../utils';

import classes from './Cart.module.scss';

const Cart = props => {
  const {
    cartItems,
    deleteItem,
    domains,
    userWallets,
    setWallet,
    hasLowBalance,
    walletCount,
  } = props;
  const count = cartItems.length;
  const isCartEmpty = count === 0;

  const handleDeleteItem = id => {
    const data = recalculateCart({ domains, cartItems, id }) || id;
    deleteItem(data);
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.header}>
          <CounterContainer isEmpty={isCartEmpty}>{count}</CounterContainer>
          <h5 className={classes.title}>Cart</h5>
        </div>
        {!isCartEmpty &&
          cartItems.map(item => (
            <div key={item.id}>
              <CartItem item={item} onDelete={handleDeleteItem} />
              {item.showBadge && (
                <Badge show type={BADGE_TYPES.INFO}>
                  <div className={classes.infoBadge}>
                    <FontAwesomeIcon
                      icon="exclamation-circle"
                      className={classes.infoIcon}
                    />
                    <p className={classes.infoText}>
                      <span className="boldText">Address Cost</span> - Your
                      account already has a free address associated with it.
                    </p>
                  </div>
                </Badge>
              )}
            </div>
          ))}
        <Link to={ROUTES.FIO_ADDRESSES} className={classes.cta}>
          <div className={classes.ctaIconContainer}>
            <FontAwesomeIcon icon="search" className={classes.ctaIcon} />
          </div>
          <p className={classNames(classes.ctaText, 'boldText')}>
            Search for more FIO addresses?
          </p>
        </Link>
        {walletCount > 1 && (
          <div className={classes.walletContainer}>
            <h6 className={classes.title}>FIO Wallet Assignment</h6>
            <p className={classes.subtitle}>
              Please choose which FIO wallet you would like these addresses
              assigned to.
            </p>
            <Form
              onSubmit={() => {}}
              render={() => (
                <form>
                  <Field
                    name="wallet"
                    component={WalletDropdown}
                    options={userWallets}
                    setWallet={setWallet}
                    initValue={userWallets[0]}
                  />
                </form>
              )}
            />
          </div>
        )}
      </div>
      {hasLowBalance && (
        <Badge type={BADGE_TYPES.ERROR} show>
          <div className={classes.errorContainer}>
            <div className={classes.textContainer}>
              <FontAwesomeIcon
                icon="exclamation-circle"
                className={classes.icon}
              />
              <p className={classes.text}>
                <span className="boldText">Low Balance!</span> - Unfortunately
                there is not enough FIO available to complete your purchase.
                Please deposit additional FIO or select a different payment
                method.
              </p>
            </div>
            <Button
              className={classes.button}
              onClick={() => {
                //todo: set action
              }}
            >
              <FontAwesomeIcon
                icon="plus-circle"
                className={classes.buttonIcon}
              />
              <p className={classes.buttonText}>Make Deposit</p>
            </Button>
          </div>
        </Badge>
      )}
    </>
  );
};

export default Cart;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
import WalletDropdown from './WalletDropdown';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { deleteCartItem } from '../../utils';

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
    totalCartAmount,
    selectedWallet,
    prices,
    recalculate,
    isPriceChanged,
  } = props;
  const count = cartItems.length;
  const isCartEmpty = count === 0;

  const walletBalance =
    (!isEmpty(selectedWallet) &&
      selectedWallet.balance !==
        null + parseFloat(selectedWallet.balance).toFixed(2)) ||
    0;

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

  return (
    <>
      {isPriceChanged && (
        <div className={classes.badgeContainer}>
          <Badge show type={BADGE_TYPES.ERROR}>
            <div className={classnames(classes.infoBadge, classes.priceBadge)}>
              <FontAwesomeIcon
                icon="exclamation-circle"
                className={classes.infoIcon}
              />
              <p className={classes.infoText}>
                <span className="boldText">Pricing update</span> - Your price
                has been updated due to pricing changes.
              </p>
            </div>
          </Badge>
        </div>
      )}
      <div className={classes.container}>
        <div className={classes.header}>
          <CounterContainer isEmpty={isCartEmpty}>{count}</CounterContainer>
          <h5 className={classes.title}>Cart</h5>
        </div>
        {!isCartEmpty &&
          cartItems.map(item => (
            <div key={item.id}>
              <CartItem item={item} onDelete={handleDeleteItem} />
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
                <span className="boldText">Low Balance!</span> - There are not
                enough FIO tokens in this FIO Wallet to complete the purchase.
                Needed: {totalCartAmount.toFixed(2)} FIO, available in wallet:{' '}
                {walletBalance} FIO. Please add FIO tokens.
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

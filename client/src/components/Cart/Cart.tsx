import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
import WalletDropdown from './WalletDropdown';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';

import { deleteCartItem } from '../../utils';

import { ROUTES } from '../../constants/routes';

import {
  FioWalletDoublet,
  Prices,
  WalletBalancesItem,
  CartItem as CartItemType,
  DeleteCartItem,
} from '../../types';

import classes from './Cart.module.scss';

type Props = {
  cartItems: CartItemType[];
  deleteItem?: (data: DeleteCartItem) => {};
  userWallets: FioWalletDoublet[];
  setWallet: (publicKey: string) => void;
  hasLowBalance: boolean;
  walletCount: number;
  totalCartAmount: string;
  walletBalancesAvailable: WalletBalancesItem;
  prices: Prices;
  recalculate?: (cartItems: CartItemType[]) => {};
  isPriceChanged: boolean;
  roe: number;
};

const Cart: React.FC<Props> = props => {
  const {
    cartItems,
    deleteItem,
    userWallets,
    setWallet,
    hasLowBalance,
    walletCount,
    totalCartAmount,
    walletBalancesAvailable,
    prices,
    recalculate,
    isPriceChanged,
    roe,
  } = props;
  const count = cartItems.length;
  const isCartEmpty = count === 0;

  const walletBalance =
    (!isEmpty(walletBalancesAvailable) && walletBalancesAvailable.fio) || 0;

  const handleDeleteItem = (id: string) => {
    deleteCartItem({
      id,
      prices,
      deleteItem,
      cartItems,
      recalculate,
      roe,
    });
  };

  const lowBalanceText = {
    buttonText: 'Make Deposit',
    messageText: `There are not
            enough FIO tokens in this FIO Wallet to complete the purchase.
            Needed: ${totalCartAmount} FIO, available in wallet:
            ${walletBalance} FIO. Please add FIO tokens.`,
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
        <Link to={ROUTES.FIO_ADDRESSES_SELECTION} className={classes.cta}>
          <div className={classes.ctaIconContainer}>
            <FontAwesomeIcon icon="search" className={classes.ctaIcon} />
          </div>
          <p className={classnames(classes.ctaText, 'boldText')}>
            Search for more FIO Crypto Handles?
          </p>
        </Link>
        {walletCount > 1 && (
          <div className={classes.walletContainer}>
            <h6 className={classes.title}>FIO Wallet Assignment</h6>
            <p className={classes.subtitle}>
              Please choose which FIO wallet you would like these FIO Crypto
              Handles assigned to.
            </p>
            <Form
              onSubmit={() => null}
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
      <LowBalanceBadge {...lowBalanceText} hasLowBalance={hasLowBalance} />
    </>
  );
};

export default Cart;

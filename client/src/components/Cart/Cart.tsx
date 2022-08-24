import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
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
import MathOp from '../../util/math';

type Props = {
  cartItems: CartItemType[];
  deleteItem?: (data: DeleteCartItem) => void;
  userWallets: FioWalletDoublet[];
  hasLowBalance: boolean;
  walletCount: number;
  totalCartAmount: string;
  totalCartNativeAmount: number;
  walletBalancesAvailable: WalletBalancesItem;
  prices: Prices;
  setCartItems?: (cartItems: CartItemType[]) => {};
  isPriceChanged: boolean;
  roe: number;
  hasGetPricesError?: boolean;
  error: string | null;
};

const Cart: React.FC<Props> = props => {
  const {
    cartItems,
    deleteItem,
    userWallets,
    hasLowBalance,
    totalCartAmount,
    totalCartNativeAmount,
    walletBalancesAvailable,
    prices,
    setCartItems,
    isPriceChanged,
    roe,
    hasGetPricesError,
    error,
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
      setCartItems,
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

  const allWalletsHasLowBalance = userWallets?.every(
    wallet =>
      wallet.available != null &&
      totalCartNativeAmount &&
      new MathOp(wallet.available).lte(totalCartNativeAmount),
  );

  let errorMessage = 'Your price has been updated due to pricing changes.';
  if (hasGetPricesError) {
    errorMessage = 'Price updating has been failed. Please, try again';
  }

  return (
    <>
      <div className={classes.badgeContainer}>
        <Badge
          show={isPriceChanged || hasGetPricesError || !!error}
          type={BADGE_TYPES.ERROR}
        >
          <div className={classnames(classes.infoBadge, classes.priceBadge)}>
            <FontAwesomeIcon
              icon="exclamation-circle"
              className={classes.infoIcon}
            />

            <p className={classes.infoText}>
              <span className="boldText">
                {error ? 'Error' : 'Pricing update'}
              </span>
              {` - `}
              {error || errorMessage}
            </p>
          </div>
        </Badge>
      </div>
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
      </div>
      <LowBalanceBadge
        {...lowBalanceText}
        hasLowBalance={hasLowBalance && !allWalletsHasLowBalance}
      />
    </>
  );
};

export default Cart;

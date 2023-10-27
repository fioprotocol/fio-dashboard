import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
import Badge, { BADGE_TYPES } from '../Badge/Badge';

import { updateCartItemPeriod } from '../../util/cart';

import { ROUTES } from '../../constants/routes';

import {
  FioWalletDoublet,
  WalletBalancesItem,
  CartItem as CartItemType,
} from '../../types';

import classes from './Cart.module.scss';

type Props = {
  cartId: string;
  cartItems: CartItemType[];
  deleteItem?: (data: { id: string; itemId: string }) => void;
  userWallets: FioWalletDoublet[];
  hasLowBalance: boolean;
  walletCount: number;
  totalCartAmount: string;
  totalCartNativeAmount: number;
  walletBalancesAvailable: WalletBalancesItem;
  setCartItems?: (cartItems: CartItemType[]) => void;
  isPriceChanged: boolean;
  roe: number;
  hasGetPricesError?: boolean;
  error: string | null;
};

const Cart: React.FC<Props> = props => {
  const {
    cartId,
    cartItems,
    deleteItem,
    setCartItems,
    isPriceChanged,
    roe,
    hasGetPricesError,
    error,
  } = props;

  const count = cartItems.length;
  const isCartEmpty = count === 0;

  const handleDeleteItem = (itemId: string) => {
    deleteItem({
      id: cartId,
      itemId,
    });
  };
  const handleUpdateItemPeriod = (id: string, period: number) => {
    updateCartItemPeriod({
      id,
      period,
      cartItems,
      setCartItems,
      roe,
    });
  };

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
            <InfoIcon className={classes.infoIcon} />

            <p className={classes.infoText}>
              <span className="boldText">
                {error ? 'Unable to purchase' : 'Pricing update'}
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
              <CartItem
                item={item}
                onDelete={handleDeleteItem}
                onUpdatePeriod={handleUpdateItemPeriod}
                isPeriodEditable
              />
            </div>
          ))}
        <Link to={ROUTES.FIO_ADDRESSES_SELECTION} className={classes.cta}>
          <div className={classes.ctaIconContainer}>
            <SearchIcon className={classes.ctaIcon} />
          </div>
          <p className={classnames(classes.ctaText, 'boldText')}>
            Search for more FIO Handles?
          </p>
        </Link>
      </div>
    </>
  );
};

export default Cart;

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
import Badge, { BADGE_TYPES } from '../Badge/Badge';

import { updateCartItemPeriod, deleteItem } from '../../redux/cart/actions';

import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
} from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';

import { ROUTES } from '../../constants/routes';

import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletBalancesItem,
} from '../../types';

import classes from './Cart.module.scss';

type Props = {
  userWallets: FioWalletDoublet[];
  hasLowBalance: boolean;
  walletCount: number;
  totalCartAmount: string;
  totalCartNativeAmount: number;
  walletBalancesAvailable: WalletBalancesItem;
  isPriceChanged: boolean;
  hasGetPricesError?: boolean;
  error: string | null;
};

const Cart: React.FC<Props> = props => {
  const { isPriceChanged, hasGetPricesError, error } = props;

  const cartId = useSelector(cartIdSelector);
  const cartItems = useSelector(cartItemsSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userId = useSelector(userIdSelector);

  const dispatch = useDispatch();

  const count = cartItems.length;
  const isCartEmpty = count === 0;

  const handleDeleteItem = useCallback(
    (item: CartItemType) => {
      dispatch(
        deleteItem({
          id: cartId,
          itemId: item.id,
          item,
          prices: prices?.nativeFio,
          roe,
          userId,
        }),
      );
    },
    [cartId, dispatch, prices?.nativeFio, roe, userId],
  );

  const handleUpdateItemPeriod = useCallback(
    ({
      cartItem,
      newPeriod,
    }: {
      cartItem: CartItemType;
      newPeriod: number;
    }) => {
      dispatch(
        updateCartItemPeriod({
          id: cartId,
          itemId: cartItem.id,
          item: cartItem,
          period: newPeriod,
          prices: prices?.nativeFio,
          roe,
        }),
      );
    },
    [cartId, dispatch, prices?.nativeFio, roe],
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

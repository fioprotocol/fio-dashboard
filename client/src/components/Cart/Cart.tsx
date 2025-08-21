import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import Loader from '../Loader/Loader';

import { updateCartItemPeriod, deleteItem } from '../../redux/cart/actions';

import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import { ROUTES } from '../../constants/routes';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';

import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletBalancesItem,
} from '../../types';

import classes from './Cart.module.scss';

type Props = {
  isNoProfileFlow: boolean;
  loading: boolean;
  userWallets: FioWalletDoublet[];
  hasLowBalance: boolean;
  walletCount: number;
  totalCartAmount: string;
  totalCartNativeAmount: string;
  walletBalancesAvailable: WalletBalancesItem;
  isPriceChanged: boolean;
  hasGetPricesError?: boolean;
};

const Cart: React.FC<Props> = props => {
  const { isNoProfileFlow, isPriceChanged, hasGetPricesError, loading } = props;

  const cartItems = useSelector(cartItemsSelector);
  const refCode = useSelector(refProfileCode);

  const dispatch = useDispatch();

  const count = cartItems.length;
  const isCartEmpty = count === 0;

  const searchLink = isNoProfileFlow
    ? {
        pathname: `${ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE.replace(
          REF_PROFILE_SLUG_NAME,
          refCode,
        )}`,
      }
    : ROUTES.FIO_ADDRESSES_SELECTION;

  const handleDeleteItem = useCallback(
    (item: CartItemType) => {
      dispatch(
        deleteItem({
          itemId: item.id,
          item,
          refCode,
        }),
      );
    },
    [dispatch, refCode],
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
          itemId: cartItem.id,
          item: cartItem,
          period: newPeriod,
        }),
      );
    },
    [dispatch],
  );

  let errorMessage =
    NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.CART_PRICES_CHANGED]
      .message;
  if (hasGetPricesError) {
    errorMessage = 'Price updating has been failed. Please, try again';
  }

  return (
    <>
      <div className={classes.badgeContainer}>
        <Badge
          show={isPriceChanged || hasGetPricesError}
          type={BADGE_TYPES.ERROR}
        >
          <div className={classnames(classes.infoBadge, classes.priceBadge)}>
            <InfoIcon className={classes.infoIcon} />

            <p className={classes.infoText}>
              <span className="boldText">
                {
                  NOTIFICATIONS_CONTENT[
                    NOTIFICATIONS_CONTENT_TYPE.CART_PRICES_CHANGED
                  ].title
                }
              </span>
              {` - `}
              {errorMessage}
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
        {loading && <Loader className="mt-4" />}
        <Link to={searchLink} className={classes.cta}>
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

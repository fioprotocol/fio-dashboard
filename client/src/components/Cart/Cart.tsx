import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import CounterContainer from '../CounterContainer/CounterContainer';
import CartItem from './CartItem';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import CustomDropdown from '../CustomDropdown';

import useEffectOnce from '../../hooks/general';
import { deleteCartItem } from '../../utils';
import { useCheckIfDesktop } from '../../screenType';

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
  setWallet: (publicKey: string) => void;
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
    setWallet,
    hasLowBalance,
    walletCount,
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

  const isDesktop = useCheckIfDesktop();

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

  const walletsList = userWallets
    .sort((a, b) => b.available - a.available || a.name.localeCompare(b.name))
    .map(wallet => ({ id: wallet.publicKey, name: wallet.name }));

  const allWalletsHasLowBalance = userWallets?.every(
    wallet =>
      wallet.available != null &&
      totalCartNativeAmount &&
      new MathOp(wallet.available).lte(totalCartNativeAmount),
  );

  useEffectOnce(() => {
    if (walletsList.length) {
      setWallet(walletsList[0].id);
    }
  }, [walletsList]);

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
        {walletCount > 1 && (
          <div className={classes.walletContainer}>
            <h6 className={classes.title}>FIO Wallet Assignment</h6>
            <p className={classes.subtitle}>
              Please choose a FIO wallet to assign your purchase(s) to.
            </p>
            <CustomDropdown
              onChange={setWallet}
              options={walletsList}
              isWhite={true}
              isSimple={true}
              isHigh={true}
              value={walletsList[0].id}
              hasBigBorderRadius={true}
              isBlackPlaceholder={true}
              hasLightBorder={true}
              fitContentWidth={isDesktop}
              hasAutoWidth={!isDesktop}
              withoutMarginBottom={true}
            />
          </div>
        )}
      </div>
      <LowBalanceBadge
        {...lowBalanceText}
        hasLowBalance={hasLowBalance && !allWalletsHasLowBalance}
      />
    </>
  );
};

export default Cart;

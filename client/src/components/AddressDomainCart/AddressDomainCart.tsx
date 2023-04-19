import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEmpty from 'lodash/isEmpty';
import { useHistory } from 'react-router-dom';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import CounterContainer from '../CounterContainer/CounterContainer';

import { ROUTES } from '../../constants/routes';
import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

import {
  handleFreeAddressCart,
  deleteCartItem,
  getCartItemDescriptor,
} from '../../util/cart';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import {
  CartItem,
  DeleteCartItem,
  Domain,
  FioWalletDoublet,
  LastAuthData,
  Prices,
  RedirectLinkData,
} from '../../types';

import classes from './AddressDomainCart.module.scss';

type Props = {
  cartItems: CartItem[];
  domains: Domain[];
  fioWallets: FioWalletDoublet[];
  prices: Prices;
  hasFreeAddress: boolean;
  isAuthenticated: boolean;
  roe: number | null;
  lastAuthData: LastAuthData;
  setCartItems: (cartItems: CartItem[]) => void;
  deleteItem: (params: DeleteCartItem) => void;
  setRedirectPath: (redirectPath: RedirectLinkData) => void;
  showLoginModal: (redirectRoute: string) => void;
};

const AddressDomainCart: React.FC<Props> = props => {
  const {
    cartItems,
    deleteItem,
    domains,
    prices,
    setCartItems,
    hasFreeAddress,
    isAuthenticated,
    setRedirectPath,
    showLoginModal,
    roe,
    lastAuthData,
  } = props;
  const count = cartItems.length;
  const domainsAmount = domains.length;
  const isCartEmpty = count === 0;
  const cartHasFreeAddress = !!cartItems.find(({ allowFree }) => allowFree);
  const cartItemsJson = JSON.stringify(cartItems);

  const history = useHistory();

  const handleCheckout = () => {
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
      getCartItemsDataForAnalytics(cartItems),
    );
    let route = ROUTES.CART;
    if (
      count === 1 &&
      !hasFreeAddress &&
      cartHasFreeAddress &&
      (isAuthenticated || !lastAuthData)
    ) {
      route = ROUTES.CHECKOUT;
    }

    if (!isAuthenticated) {
      setRedirectPath({ pathname: route });
      return lastAuthData
        ? showLoginModal(route)
        : history.push(ROUTES.CREATE_ACCOUNT);
    }
    history.push(route);
  };

  const handleDeleteItem = (id: string) => {
    deleteCartItem({
      id,
      prices,
      cartItems,
      roe,
      deleteItem,
      setCartItems,
    });
  };

  useEffect(() => {
    if (domainsAmount === 0 && hasFreeAddress === null) return;
    handleFreeAddressCart({
      cartItems: JSON.parse(cartItemsJson),
      prices,
      hasFreeAddress,
      setCartItems,
      roe,
    });
  }, [cartItemsJson, domainsAmount, hasFreeAddress, prices, setCartItems, roe]);

  return (
    <CartSmallContainer isAquaColor={true}>
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
                      {`${item.address}${FIO_ADDRESS_DELIMITER}${item.domain}`}
                    </p>
                  ) : (
                    <p className={classes.itemName}>{item.domain}</p>
                  )}
                  <p className={classes.itemDescriptor}>
                    <span>{getCartItemDescriptor(item.type, item.period)}</span>
                  </p>
                  <p className={classes.itemPrice}>
                    <span className="boldText">
                      Cost:{' '}
                      {!Number.isFinite(item.costNativeFio) ||
                      item.domainType === DOMAIN_TYPE.FREE ||
                      item.domainType === DOMAIN_TYPE.PRIVATE
                        ? 'FREE'
                        : `${item.costFio} FIO
                      (${item.costUsdc} USDC)`}
                    </span>{' '}
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

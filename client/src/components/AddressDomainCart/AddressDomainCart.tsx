import React from 'react';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import CounterContainer from '../CounterContainer/CounterContainer';
import Loader from '../Loader/Loader';

import { ExclamationIcon } from '../ExclamationIcon';
import { PriceComponent } from '../PriceComponent';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import {
  isNoProfileFlow as isNoProfileFlowSelector,
  refProfileCode,
} from '../../redux/refProfile/selectors';

import { useMetaMaskProvider } from '../../hooks/useMetaMaskProvider';

import { ROUTES } from '../../constants/routes';
import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';

import { FIO_ADDRESS_DELIMITER } from '../../utils';
import { cartHasOnlyFreeItems, getCartItemDescriptor } from '../../util/cart';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import {
  CartItem,
  FioWalletDoublet,
  LastAuthData,
  NativePrices,
  RedirectLinkData,
  Roe,
} from '../../types';

import classes from './AddressDomainCart.module.scss';

type Props = {
  cartId: string;
  cartItems: CartItem[];
  fioWallets: FioWalletDoublet[];
  hasFreeAddress: boolean;
  isAuthenticated: boolean;
  lastAuthData: LastAuthData;
  loading: boolean;
  deleteItem: (data: {
    itemId: string;
    item: CartItem;
    prices: NativePrices;
    refCode?: string;
    roe: Roe;
  }) => void;
  setRedirectPath: (redirectPath: RedirectLinkData) => void;
  showLoginModal: (redirectRoute: string) => void;
};

const AddressDomainCart: React.FC<Props> = props => {
  const {
    cartItems,
    deleteItem,
    hasFreeAddress,
    isAuthenticated,
    setRedirectPath,
    showLoginModal,
    lastAuthData,
    loading,
  } = props;
  const count = cartItems.length;

  const prices = useSelector(pricesSelector);
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);
  const isNoProfileFlow = useSelector(isNoProfileFlowSelector);
  const metaMaskProvider = useMetaMaskProvider();
  const isMetaMask = !!metaMaskProvider;

  const isCartEmpty = count === 0;
  const cartHasFreeAddress = !!cartItems.every(({ isFree }) => isFree);

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

    if (!isAuthenticated && !isNoProfileFlow) {
      const isAlternativeUser = isMetaMask;

      setRedirectPath({ pathname: route });
      return lastAuthData || isAlternativeUser
        ? showLoginModal(route)
        : history.push(ROUTES.CREATE_ACCOUNT);
    }
    history.push(route);
  };

  const handleDeleteItem = (item: CartItem) => {
    deleteItem({
      itemId: item.id,
      item,
      prices: prices?.nativeFio,
      refCode,
      roe,
    });
  };

  return (
    <CartSmallContainer isAquaColor={true}>
      <div className={classes.header}>
        <CounterContainer isEmpty={isCartEmpty}>{count}</CounterContainer>
        <h5 className={classes.title}>Cart</h5>
      </div>
      {isCartEmpty ? (
        <>
          {loading ? (
            <Loader className="mt-4" />
          ) : (
            <div className={classes.textContainer}>
              <h5 className={classes.textTitle}>Your Cart is Empty</h5>
              <p className={classes.text}>
                Add a FIO domain to start your journey in the world of
                interoperability
              </p>
            </div>
          )}
        </>
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
                    <span>
                      {getCartItemDescriptor({
                        type: item.type,
                        period: item.period,
                        hasCustomDomainInCart: item.hasCustomDomainInCart,
                      })}
                    </span>
                  </p>
                  <div className={classes.itemPrice}>
                    <span className="boldText">Cost: </span>
                    <PriceComponent
                      costFio={item.costFio}
                      costUsdc={item.costUsdc}
                      isFree={item.isFree}
                    />
                  </div>
                </div>

                <DeleteIcon
                  className={classes.deleteIcon}
                  onClick={() => handleDeleteItem(item)}
                />
              </div>
            ))}
          {loading && <Loader className="mt-3 mb-3" />}
          {!isEmpty(cartItems) && !cartHasOnlyFreeItems(cartItems) && (
            <>
              <hr />
              <div className={classes.actionTextContainer}>
                <ExclamationIcon />
                <span className={classes.actionText}>
                  You can pay with a credit card OR crypto!
                </span>
              </div>
            </>
          )}
          <Button className={classes.button} onClick={handleCheckout}>
            <ShoppingCartIcon className={classes.cartIcon} />{' '}
            <p>Checkout now</p>
          </Button>
        </div>
      )}
    </CartSmallContainer>
  );
};

export default AddressDomainCart;

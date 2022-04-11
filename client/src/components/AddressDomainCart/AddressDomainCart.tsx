import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import CounterContainer from '../CounterContainer/CounterContainer';

import { ROUTES } from '../../constants/routes';

import { handleFreeAddressCart, deleteCartItem } from '../../utils';

import {
  CartItem,
  DeleteCartItem,
  Domain,
  FioWalletDoublet,
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
  recalculate: (cartItems: CartItem[]) => void;
  deleteItem: (params: DeleteCartItem) => void;
  setRedirectPath: (redirectPath: RedirectLinkData) => void;
};

const AddressDomainCart: React.FC<Props> = props => {
  const {
    cartItems,
    deleteItem,
    domains,
    fioWallets,
    prices,
    recalculate,
    hasFreeAddress,
    isAuthenticated,
    setRedirectPath,
    roe,
  } = props;
  const count = cartItems.length;
  const domainsAmount = domains.length;
  const isCartEmpty = count === 0;
  const cartItemsJson = JSON.stringify(cartItems);

  const history = useHistory();

  const handleCheckout = () => {
    const multipleWallets = fioWallets && fioWallets.length > 1;
    const route =
      count === 1 && !multipleWallets ? ROUTES.CHECKOUT : ROUTES.CART;

    if (!isAuthenticated) {
      setRedirectPath({ pathname: route });
      return history.push(ROUTES.CREATE_ACCOUNT);
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
      recalculate,
    });
  };

  useEffect(() => {
    if (domainsAmount === 0 && hasFreeAddress === null) return;
    handleFreeAddressCart({
      cartItems: JSON.parse(cartItemsJson),
      prices,
      hasFreeAddress,
      recalculate,
    });
  }, [cartItemsJson, domainsAmount, hasFreeAddress, prices, recalculate]);

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
                      <span className="boldText">{item.address}</span>
                      <span
                        className={
                          item.hasCustomDomain ? 'boldText' : classes.thin
                        }
                      >
                        @{item.domain}
                      </span>
                    </p>
                  ) : (
                    <p className={classes.itemName}>
                      <span className="boldText">{item.domain}</span>
                    </p>
                  )}
                  <p className={classes.itemPrice}>
                    Cost:{' '}
                    <span className="boldText">
                      {!Number.isFinite(item.costNativeFio)
                        ? 'FREE'
                        : `${item.costFio} FIO
                      (${item.costUsdc} USDC)`}
                    </span>{' '}
                    {item.address ? null : (
                      <span className={classes.thin}>- annually</span>
                    )}
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

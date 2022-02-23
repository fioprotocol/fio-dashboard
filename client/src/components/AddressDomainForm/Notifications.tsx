import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import { FormProps } from 'react-final-form';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../AddressDomainBadge/AddressDomainBadge';
import InfoBadge from '../InfoBadge/InfoBadge';
import { deleteCartItem, isFreeDomain } from '../../utils';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';

import { CartItem, Domain, DeleteCartItem, Prices } from '../../types';

import classes from './AddressDomainForm.module.scss';

const AVAILABLE_MESSAGE = {
  [ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS]:
    'The FIO Crypto Handle you requested is available',
  [ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN]:
    'The FIO domain you requested is available',
};

type Error =
  | {
      message: string;
      showInfoError?: boolean;
    }
  | string;

type FormError = {
  [key: string]: Error;
};

type Props = {
  cartItems: CartItem[];
  currentCartItem: CartItem | undefined;
  domains: Domain[];
  formErrors: FormError;
  formProps: FormProps;
  isAddress: boolean;
  isDomain: boolean;
  isFree: boolean;
  hasCustomDomain: boolean;
  prices: Prices;
  showAvailable: boolean;
  type: string;
  addItem: (data: CartItem) => void;
  deleteItem: (data: DeleteCartItem) => {};
  recalculate: (cartItems: CartItem[]) => {};
  showPrice: () => string;
  isDesktop: boolean;
  toggleShowAvailable: (isAvailable: boolean) => boolean;
  roe: number;
};

const Notifications = (props: Props, ref: React.Ref<HTMLDivElement | null>) => {
  const {
    cartItems,
    currentCartItem,
    domains,
    formErrors,
    formProps,
    isAddress,
    isDomain,
    isFree,
    hasCustomDomain,
    prices,
    showAvailable,
    type,
    isDesktop,
    roe,
    addItem,
    deleteItem,
    recalculate,
    toggleShowAvailable,
    showPrice,
  } = props;
  const { values, form } = formProps;
  const errors: (string | { message: string; showInfoError?: boolean })[] = [];
  !isEmpty(formErrors) &&
    Object.keys(formErrors).forEach(key => {
      const fieldState = form.getFieldState(key);
      const { touched, modified, submitSucceeded } = fieldState || {};
      if (touched || modified || submitSucceeded) {
        errors.push(formErrors[key]);
      }
    });

  const { address, domain: domainName } = values || {};
  const {
    nativeFio: { address: natvieFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const hasOnlyDomain =
    domainName &&
    cartItems.some(
      (item: CartItem) =>
        !item.address && item.domain === domainName.toLowerCase(),
    );
  const hasErrors = !isEmpty(errors);

  let costNativeFio = 0;

  if (!isFree && isAddress) {
    costNativeFio = isAddress ? natvieFioAddressPrice : nativeFioDomainPrice;
  }
  if (hasCustomDomain) {
    costNativeFio = costNativeFio
      ? new MathOp(costNativeFio).add(nativeFioDomainPrice).toNumber()
      : nativeFioDomainPrice;
  }
  if (!isFree && currentCartItem) {
    costNativeFio = currentCartItem.costNativeFio;
  }

  const fioPrices = convertFioPrices(costNativeFio, roe);

  const costFio = fioPrices.fio;
  const costUsdc = fioPrices.usdc;

  const addItemToCart = () => {
    let id = '';
    if (address) {
      id = address + '@';
    }

    id += domainName;

    const newCartItem: CartItem = {
      ...values,
      id,
      allowFree: isFreeDomain({ domains, domain: domainName }),
    };

    if ((address && hasCustomDomain) || hasOnlyDomain)
      newCartItem.hasCustomDomain = true;
    if (costNativeFio && costNativeFio > 0)
      newCartItem.costNativeFio = costNativeFio;
    if (address && hasOnlyDomain) {
      newCartItem.costNativeFio = new MathOp(newCartItem.costNativeFio)
        .add(nativeFioDomainPrice)
        .toNumber();
      const recalcFioPrices = convertFioPrices(newCartItem.costNativeFio, roe);
      newCartItem.costFio = recalcFioPrices.fio;
      newCartItem.costUsdc = recalcFioPrices.usdc;

      recalculate([
        ...cartItems.filter(
          (item: CartItem) => item.domain !== domainName.toLowerCase(),
        ),
        newCartItem,
      ]);
    } else {
      const addItemFioPrices = convertFioPrices(newCartItem.costNativeFio, roe);
      newCartItem.costFio = addItemFioPrices.fio;
      newCartItem.costUsdc = addItemFioPrices.usdc;
      addItem(newCartItem);
    }
  };

  const availableMessage = !isDesktop ? showPrice() : AVAILABLE_MESSAGE[type];
  const notifBadge = () => (
    <div ref={ref}>
      <InfoBadge
        type={BADGE_TYPES.SUCCESS}
        show={showAvailable}
        title="Available!"
        message={availableMessage}
        hasBoldMessage={!isDesktop}
      />
      {errors.map(error => {
        if (typeof error === 'string')
          return (
            <InfoBadge
              type={BADGE_TYPES.ERROR}
              title="Try Again!"
              show={hasErrors}
              message={error}
              key={error}
            />
          );
        if (typeof error !== 'string' && error.message)
          return (
            <InfoBadge
              type={error.showInfoError ? BADGE_TYPES.INFO : BADGE_TYPES.ERROR}
              title={error.showInfoError ? '' : 'Try Again!'}
              show={hasErrors}
              message={error.message}
              key={error.message}
            />
          );
        return null;
      })}
    </div>
  );

  return (
    <div key="badges">
      {notifBadge()}
      <Badge type={BADGE_TYPES.SIMPLE} show={showAvailable}>
        <div
          className={classnames(
            classes.addressContainer,
            !hasErrors && classes.showPrice,
          )}
        >
          <p className={classes.address}>
            {isAddress && (
              <>
                <span className={classes.name}>{address}</span>@
              </>
            )}
            {isDomain ? (
              <span className={classes.name}>{domainName}</span>
            ) : (
              domainName
            )}
          </p>
          <p className={classes.price}>
            {isFree && !hasCustomDomain ? (
              'FREE'
            ) : (
              <>
                {costFio} FIO{' '}
                <span className={classes.usdcAmount}>({costUsdc} USDC)</span>
              </>
            )}
          </p>
          <div className={classes.actionContainer}>
            <Button
              className={classnames(
                classes.button,
                !currentCartItem && classes.show,
              )}
              onClick={addItemToCart}
            >
              <FontAwesomeIcon icon="plus-square" className={classes.icon} />
              Add to Cart
            </Button>
            <div
              className={classnames(
                classes.added,
                currentCartItem && classes.show,
              )}
            >
              <div className={classes.fioBadge}>
                <FontAwesomeIcon icon="check-circle" className={classes.icon} />
                <p className={classes.title}>Added</p>
              </div>
              <FontAwesomeIcon
                icon="times-circle"
                className={classes.iconClose}
                onClick={() => {
                  deleteCartItem({
                    id: currentCartItem.id,
                    prices,
                    deleteItem,
                    cartItems,
                    recalculate,
                    roe,
                  });
                  toggleShowAvailable(false);
                }}
              />
            </div>
          </div>
        </div>
      </Badge>
    </div>
  );
};

const NotificationsRef = React.forwardRef<HTMLDivElement, Props>(Notifications);

export default NotificationsRef;

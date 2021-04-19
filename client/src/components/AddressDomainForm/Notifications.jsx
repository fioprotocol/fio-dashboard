import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import _ from 'lodash';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../AddressDomainBadge/AddressDomainBadge';
import InfoBadge from '../InfoBadge/InfoBadge';

import classes from './AddressDomainForm.module.scss';

const AVAILABLE_MESSAGE = {
  [ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS]:
    'The FIO address you requested is available',
  [ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN]:
    'The FIO domain you requested is available',
};

const Notifications = props => {
  const {
    formProps,
    isCustomDomain,
    isAvailable,
    toggleAvailable,
    type,
    cartItems,
    updateCart,
    prices,
    isAddress,
    isDomain,
    formErrors,
  } = props;
  const { values, form } = formProps;
  const errors = [];

  !_.isEmpty(formErrors) &&
    Object.keys(formErrors).forEach(key => {
      const fieldState = form.getFieldState(key) || {};
      const { touched, modified, submitSucceeded } = fieldState;
      if (touched || modified || submitSucceeded) {
        errors.push(formErrors[key]);
      }
    });

  const { username, domain: domainName } = values || {};
  const {
    usdt: { domain: domainPrice, address: addressPrice },
  } = prices;
  const fioAmount = prices.fio.address;

  const isOnCart = cartItems.some(item => _.isEqual(item, values));
  const hasErrors = !_.isEmpty(errors);
  let price = isAddress ? parseInt(addressPrice) : parseInt(domainPrice);

  if (isCustomDomain) {
    price += parseInt(domainPrice);
  }

  const notifBadge = () => (
    <>
      <InfoBadge
        type={BADGE_TYPES.SUCCESS}
        show={isAvailable}
        title="Available!"
        message={AVAILABLE_MESSAGE[type]}
      />
      {errors.map(message => {
        return (
          <InfoBadge
            type={BADGE_TYPES.ERROR}
            title="Try Again!"
            show={hasErrors}
            message={message}
            key={message}
          />
        );
      })}
    </>
  );

  return (
    <div key="badges">
      {notifBadge()}
      <Badge type={BADGE_TYPES.SIMPLE} show={isAvailable}>
        <div
          className={classnames(
            classes.addressContainer,
            !hasErrors && classes.showPrice,
          )}
        >
          <p className={classes.address}>
            {isAddress && (
              <>
                <span className={classes.name}>{username}</span>@
              </>
            )}
            {isDomain ? (
              <span className={classes.name}>{domainName}</span>
            ) : (
              domainName
            )}
          </p>
          <p className={classes.price}>
            {price} USDC{' '}
            {fioAmount && (
              <span className={classes.fioAmount}>({fioAmount} FIO)</span>
            )}
          </p>
          <div className={classes.actionContainer}>
            <Button
              className={classnames(classes.button, !isOnCart && classes.show)}
              onClick={() => updateCart([...cartItems, values])} //todo: set add item to cart action
            >
              <FontAwesomeIcon icon="plus-square" className={classes.icon} />
              Add to Cart
            </Button>
            <div
              className={classnames(classes.added, isOnCart && classes.show)}
            >
              <div className={classes.fioBadge}>
                <FontAwesomeIcon icon="check-circle" className={classes.icon} />
                <p className={classes.title}>Added</p>
              </div>
              <FontAwesomeIcon
                icon="times-circle"
                className={classes.iconClose}
                onClick={() => {
                  const updArr = cartItems.filter(
                    item => !_.isEqual(item, values),
                  );
                  updateCart(updArr);
                  toggleAvailable(false);
                }} //todo: set remove item from cart action
              />
            </div>
          </div>
        </div>
      </Badge>
    </div>
  );
};

export default Notifications;

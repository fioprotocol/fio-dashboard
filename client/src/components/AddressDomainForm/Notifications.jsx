import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';

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
    cart,
    addItem,
    deleteItem,
    prices,
    isAddress,
    isDomain,
    formErrors,
    isFree,
  } = props;
  const { values, form } = formProps;
  const errors = [];
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    setCurrentId(null);
  }, [values]);

  !isEmpty(formErrors) &&
    Object.keys(formErrors).forEach(key => {
      const fieldState = form.getFieldState(key) || {};
      const { touched, modified, submitSucceeded } = fieldState;
      if (touched || modified || submitSucceeded) {
        errors.push(formErrors[key]);
      }
    });

  const { address, domain: domainName } = values || {};
  const {
    usdt: { domain: domainPrice, address: addressPrice },
    fio: { domain: fioDomainPrice, address: fioAddressPrice },
  } = prices;

  const isOnCart = cart.some(item => item.id === currentId);

  const hasErrors = !isEmpty(errors);
  let costUsdc;
  let costFio;

  if (!isFree && isAddress) {
    costUsdc = isAddress ? parseFloat(addressPrice) : parseFloat(domainPrice);
    costFio = isAddress
      ? parseFloat(fioAddressPrice)
      : parseFloat(fioDomainPrice);
  }
  if (isCustomDomain) {
    costUsdc = costUsdc
      ? costUsdc + parseFloat(domainPrice)
      : parseFloat(domainPrice);
    costFio = costFio
      ? costFio + parseFloat(fioDomainPrice)
      : parseFloat(fioDomainPrice);
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
            {isFree && !isCustomDomain ? (
              'FREE'
            ) : (
              <>
                {costFio.toFixed(2)}FIO{' '}
                {costUsdc && (
                  <span className={classes.usdcAmount}>
                    ({costUsdc.toFixed(2)} USDC)
                  </span>
                )}
              </>
            )}
          </p>
          <div className={classes.actionContainer}>
            <Button
              className={classnames(classes.button, !isOnCart && classes.show)}
              onClick={() => {
                let id = domainName;
                if (address) {
                  id += address;
                }

                const data = {
                  ...values,
                  costFio: costFio,
                  costUsdc: costUsdc,
                  id,
                };

                if (costFio) data.costFio = costFio;
                if (costUsdc) data.costUsdc = costUsdc;
                addItem(data);
                setCurrentId(id);
              }}
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
                  deleteItem({ id: currentId });
                  toggleAvailable(false);
                }}
              />
            </div>
          </div>
        </div>
      </Badge>
    </div>
  );
};

export default Notifications;

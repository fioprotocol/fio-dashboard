import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../Cart/CartItem';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { totalCost } from '../../utils';

import classes from './Purchase.module.scss';

const RenderTotalBadge = ({ fio, usdc, costFree, customTitle, customType }) => (
  <Badge type={customType || BADGE_TYPES.BLACK} show>
    <div className={classnames(classes.item, classes.total)}>
      <span className="boldText">{customTitle || 'Total Cost'}</span>
      <p className={classes.totalPrice}>
        <span className="boldText">
          {fio && usdc ? `${fio} FIO / ${usdc} USDC` : costFree}
        </span>
      </p>
    </div>
  </Badge>
);

export const RenderChekout = props => {
  const { cart, isDesktop, isFree, currentWallet } = props;
  const { costFio, costUsdc, costFree } = totalCost(cart);

  const walletBalance = (costFio, costUsdc) => {
    const wallet = currentWallet.balance || 0;
    let walletUsdc = 0;
    if (wallet > 0) {
      walletUsdc = (wallet * costUsdc) / costFio;
    }
    return `${wallet && wallet.toFixed(2)} FIO / ${walletUsdc &&
      walletUsdc.toFixed(2)} USDC`;
  };

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => <CartItem item={item} key={item.id} />)}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Payment Details</h6>
        <RenderTotalBadge fio={costFio} usdc={costUsdc} costFree={costFree} />
        {!isDesktop && !isFree && (
          <h6 className={classnames(classes.subtitle, classes.paymentTitle)}>
            Paying With
          </h6>
        )}
        {!isFree && (
          <Badge type={BADGE_TYPES.WHITE} show>
            <div className={classes.item}>
              {isDesktop && (
                <span className={classnames('boldText', classes.title)}>
                  Paying With
                </span>
              )}
              <div className={classes.wallet}>
                <p className={classes.title}>
                  <span className="boldText">FIO Wallet</span>
                </p>
                <p className={classes.balance}>
                  (Available Balance {walletBalance(costFio, costUsdc)})
                </p>
              </div>
            </div>
          </Badge>
        )}
      </div>
    </>
  );
};

export const RenderPurchase = props => {
  const { hasErrors, regItems, errItems } = props;

  const {
    costFio: regCostFio,
    costUsdc: regCostUsdc,
    costFree: regFree,
  } = totalCost(regItems);

  const {
    costFio: errCostFio,
    costUsdc: errCostUsdc,
    costFree: errFree,
  } = totalCost(errItems);

  let customTitle = '',
    customType = '',
    totalSubtitle = 'Payment Details';

  if (hasErrors) {
    customTitle = 'Total Cost Remaining';
    customType = BADGE_TYPES.ERROR;
    totalSubtitle = 'Purchase Details';
  }

  return (
    <>
      {!isEmpty(regItems) && (
        <div className={classes.details}>
          <h5 className={classes.completeTitle}>Purchases Completed</h5>
          <h6 className={classes.subtitle}>Purchase Details</h6>
          {regItems.map(item => (
            <CartItem item={item} key={item.id} />
          ))}
          <RenderTotalBadge
            fio={regCostFio}
            usdc={regCostUsdc}
            costFree={regFree}
          />
        </div>
      )}
      {hasErrors && (
        <>
          <Badge type={BADGE_TYPES.ERROR} show>
            <div className={classes.errorContainer}>
              <div className={classes.textContainer}>
                <FontAwesomeIcon
                  icon="exclamation-circle"
                  className={classes.icon}
                />
                <p className={classes.text}>
                  <span className="boldText">Incomplete Purchase!</span> - Your
                  purchase was not completed in full. Please see below what
                  failed to be completed.
                </p>
              </div>
            </div>
          </Badge>
          <div className={classes.details}>
            <h5 className={classnames(classes.completeTitle, classes.second)}>
              Purchases Not Completed
            </h5>
            <h6 className={classes.subtitle}>{totalSubtitle}</h6>
            {errItems.map(item => (
              <CartItem item={item} key={item.id} />
            ))}
            <RenderTotalBadge
              fio={errCostFio}
              usdc={errCostUsdc}
              costFree={errFree}
              customTitle={customTitle}
              customType={customType}
            />
          </div>
        </>
      )}
    </>
  );
};

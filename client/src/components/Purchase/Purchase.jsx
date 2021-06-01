import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CartItem from '../Cart/CartItem';
import PurchaseNow from '../PurchaseNow';
import Processing from './Processing';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import { totalCost } from '../../utils';
import { ROUTES } from '../../constants/routes';
import classes from './Purchase.module.scss';

const Purchase = props => {
  const {
    isCheckout,
    isPurchase,
    cart,
    paymentWallet,
    history,
    isFree,
    recalculate,
    registrationResult: results,
    fioWallets,
    refreshBalance,
    setWallet,
  } = props;

  const [isProcessing, setProcessing] = useState(false);
  const [errItems, setErrItems] = useState([]);
  const [regItems, setRegItems] = useState([]);

  const hasErrors = !isEmpty(errItems);

  useEffect(() => {
    if (!isEmpty(results)) {
      const retCart = [...cart];

      if (!isEmpty(results.errors)) {
        for (const item of results.errors) {
          const { fioName, error } = item;

          const retItemIndex = retCart.findIndex(cartItem => {
            const rep = fioName.replace('@', '');
            return cartItem.id === rep;
          });
          retCart[retItemIndex] = { ...retCart[retItemIndex], error };
        }
      }

      const regCart = retCart.filter(item => !item.error);
      const errCart = retCart.filter(item => item.error);

      recalculate(errCart);
      setRegItems(regCart);
      setErrItems(errCart);
    }
    return () => {
      setRegItems([]);
      setErrItems([]);
    };
  }, [results]);

  useEffect(() => {
    if (!isEmpty(fioWallets) && isCheckout) {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          refreshBalance(fioWallet.publicKey);
        }
      }
      if (!paymentWallet && fioWallets.length === 1) {
        setWallet(fioWallets[0].id);
      }
    }
  }, []);

  const handleClick = () => {
    if (results) {
      setProcessing(false);
      history.push(ROUTES.PURCHASE);
    }

    if (isPurchase && !hasErrors) {
      history.push(ROUTES.DASHBOARD);
    }
  };

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  const { costFio, costUsdc, costFree } = totalCost(cart);

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

  const walletBalance = (costFio, costUsdc) => {
    const wallet = paymentWallet.balance || 0;
    let walletUsdc = 0;
    if (wallet > 0) {
      walletUsdc = (wallet * costUsdc) / costFio;
    }
    return `${wallet && wallet.toFixed(2)} FIO / ${walletUsdc &&
      walletUsdc.toFixed(2)} USDC`;
  };

  const renderTotalBadge = ({
    fio,
    usdc,
    costFree,
    customTitle,
    customType,
  }) => (
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

  const renderChekout = () => {
    return (
      <>
        <div className={classes.details}>
          <h6 className={classes.subtitle}>Purchase Details</h6>
          {!isEmpty(cart) &&
            cart.map(item => <CartItem item={item} key={item.id} />)}
        </div>
        <div className={classes.details}>
          <h6 className={classes.subtitle}>Payment Details</h6>
          {renderTotalBadge({
            fio: costFio,
            usdc: costUsdc,
            costFree,
          })}
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

  const renderPurchase = () => {
    let totalFio = regCostFio,
      totalUsdc = regCostUsdc,
      totalFree = regFree,
      customTitle = '',
      customType = '',
      totalSubtitle = 'Payment Details';

    if (hasErrors) {
      totalFio = errCostFio;
      totalUsdc = errCostUsdc;
      totalFree = errFree;
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
            {renderTotalBadge({
              fio: regCostFio,
              usdc: regCostUsdc,
              costFree: totalFree,
            })}
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
                    <span className="boldText">Incomplete Purchase!</span> -
                    Your purchase was not completed in full. Please see below
                    what failed to be completed.
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
              {renderTotalBadge({
                fio: totalFio,
                usdc: totalUsdc,
                costFree: totalFree,
                customTitle,
                customType,
              })}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div
      className={classnames(classes.container, hasErrors && classes.hasErrors)}
    >
      {isCheckout && renderChekout()}
      {isPurchase && renderPurchase()}
      {isCheckout || (isPurchase && hasErrors) ? (
        <PurchaseNow
          onFinish={handleClick}
          setProcessing={setProcessing}
          isRetry={isPurchase && hasErrors}
        />
      ) : (
        <Button onClick={handleClick} className={classes.button}>
          Close
        </Button>
      )}
      <Processing isProcessing={isProcessing} />
    </div>
  );
};

export default withRouter(Purchase);

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../Cart/CartItem';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import { PayWalletInfo } from '../Badges/PayWithBadge/PayWalletInfo';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import Badge, { BADGE_TYPES } from '../Badge/Badge';

import CustomDropdown from '../CustomDropdown';

import { totalCost } from '../../utils';

import { ERROR_MESSAGES, ERROR_TYPES } from '../../constants/errors';

import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
} from '../../types';

import classes from './CheckoutPurchaseContainer.module.scss';

type RenderTotalBadgeProps = {
  costNativeFio: number;
  costFree: string;
  costFio: string;
  costUsdc: string;
};

const RenderTotalBadge: React.FC<RenderTotalBadgeProps> = ({
  costNativeFio,
  costFree,
  costFio,
  costUsdc,
}) => (
  <PriceBadge
    costNativeFio={costNativeFio}
    costFree={costFree}
    costFio={costFio}
    costUsdc={costUsdc}
    title="Total Cost"
    type={BADGE_TYPES.BLACK}
  />
);

type RenderCheckoutProps = {
  cart: CartItemType[];
  walletBalances: WalletBalancesItem;
  walletName: string;
  roe: number | null;
  fioWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  setWallet: (publicKey: string) => void;
};

export const RenderCheckout: React.FC<RenderCheckoutProps> = props => {
  const {
    cart,
    walletBalances,
    walletName,
    roe,
    fioWallets,
    paymentWalletPublicKey,
    fioWalletsBalances,
    setWallet,
  } = props;
  const { costNativeFio, costFree, costFio, costUsdc } = totalCost(cart, roe);

  const walletsList = fioWallets
    .filter(wallet => wallet.available > 0)
    .sort((a, b) => b.available - a.available || a.name.localeCompare(b.name))
    .map(wallet => {
      const { fio, usdc } = fioWalletsBalances.wallets[
        wallet.publicKey
      ].available;

      return {
        id: wallet.publicKey,
        name: (
          <div className="p-2">
            <PayWalletInfo
              walletName={wallet.name}
              fioBalance={fio}
              usdcBalance={usdc}
            />
          </div>
        ),
      };
    });

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => <CartItem item={item} key={item.id} />)}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Payment Details</h6>
        <RenderTotalBadge
          costNativeFio={costNativeFio}
          costFree={costFree}
          costFio={costFio}
          costUsdc={costUsdc}
        />
      </div>
      {fioWallets.length === 1 ? (
        <PayWithBadge
          costFree={!!costFree}
          walletBalances={walletBalances}
          walletName={walletName}
        />
      ) : (
        <>
          <div className={classes.details}>
            <h6 className={classes.subtitle}>
              FIO wallet Payment & Assignment
            </h6>
            <p className={classes.text}>
              Please choose which FIO wallet you would like to use for payment
              and assignment
            </p>
          </div>

          <CustomDropdown
            onChange={setWallet}
            options={walletsList}
            isWhite={true}
            isSimple={true}
            hasAutoHeight={true}
            value={paymentWalletPublicKey}
            hasBigBorderRadius={true}
            isBlackPlaceholder={true}
            hasLightBorder={true}
            withoutMarginBottom={true}
          />
        </>
      )}
    </>
  );
};

type RenderPurchaseProps = {
  hasErrors: boolean;
  regItems: CartItemType[];
  errItems: CartItemType[];
  roe: number | null;
};

export const RenderPurchase: React.FC<RenderPurchaseProps> = props => {
  const { hasErrors, regItems, errItems, roe } = props;

  const {
    costNativeFio: regCostNativeFio,
    costFree: regFree,
    costFio: regCostFio,
    costUsdc: regCostUsdc,
  } = totalCost(regItems, roe);

  const {
    costNativeFio: errCostNativeFio,
    costFree: errFree,
    costFio: errCostFio,
    costUsdc: errCostUsdc,
  } = totalCost(errItems, roe);

  let customTitle = 'Total Cost',
    customType = BADGE_TYPES.BLACK,
    totalSubtitle = 'Payment Details';

  if (hasErrors) {
    customTitle = 'Total Cost Remaining';
    customType = BADGE_TYPES.ERROR;
    totalSubtitle = 'Purchase Details';
  }

  const allErrored = isEmpty(regItems) && !isEmpty(errItems);

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
            costNativeFio={regCostNativeFio}
            costFree={regFree}
            costFio={regCostFio}
            costUsdc={regCostUsdc}
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
                {allErrored ? (
                  <p className={classes.text}>
                    <span className="boldText">Purchase failed!</span> -{' '}
                    {ERROR_MESSAGES[errItems[0].errorType] ||
                      ERROR_MESSAGES[ERROR_TYPES.default]}
                  </p>
                ) : (
                  <p className={classes.text}>
                    <span className="boldText">Incomplete Purchase!</span> -
                    Your purchase was not completed in full. Please see below
                    what failed to be completed.
                  </p>
                )}
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
            {!errFree && !allErrored && (
              <PriceBadge
                costNativeFio={errCostNativeFio}
                costFree={errFree}
                title={customTitle}
                type={customType}
                costFio={errCostFio}
                costUsdc={errCostUsdc}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

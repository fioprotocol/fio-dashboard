import { FC } from 'react';

import { useSelector } from 'react-redux';

import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import { PriceComponent } from '../PriceComponent';

import { TransactionDetailsItem } from './components/TransactionDetailsItem';

import { convertFioPrices } from '../../util/prices';

import { roe as roeSelector } from '../../redux/registrations/selectors';
import { WalletBalancesItem } from '../../types';
import { PayWalletInfo } from '../Badges/PayWithBadge/PayWalletInfo';

import classes from './TransactionDetails.module.scss';
import { POSITIONS, PositionValue } from './constants';

type AdditionalDetails = {
  label: string;
  value: string;
  link?: string;
  hide?: boolean;
  wrap?: boolean;
};

type Props = {
  className?: string;
  feeInFio?: number;
  amountInFio?: number;
  bundles?: {
    fee: number;
    remaining?: number;
  };
  payWith?: {
    walletBalances: WalletBalancesItem;
    walletName?: string;
  };
  additional?: AdditionalDetails[];
};

export const TransactionDetails: FC<Props> = ({
  className,
  feeInFio,
  amountInFio,
  bundles,
  payWith,
  additional = [],
}) => {
  const roe = useSelector(roeSelector);

  const valuePosition: PositionValue = payWith
    ? POSITIONS.LEFT
    : POSITIONS.RIGHT;

  const feeRender = () => {
    if (typeof feeInFio !== 'number' || feeInFio === 0) {
      return null;
    }

    const fee = convertFioPrices(feeInFio, roe);

    return (
      <TransactionDetailsItem
        position={valuePosition}
        name="Transaction Fee"
        value={<PriceComponent costFio={fee.fio} costUsdc={fee.usdc} />}
      />
    );
  };

  const totalRender = () => {
    if (
      typeof feeInFio !== 'number' ||
      typeof amountInFio !== 'number' ||
      feeInFio === amountInFio
    ) {
      return null;
    }

    const totalFio = feeInFio + amountInFio;

    const total = convertFioPrices(totalFio, roe);

    return (
      <TransactionDetailsItem
        position={valuePosition}
        name="Total"
        value={
          <PriceComponent
            costFio={total.fio}
            costUsdc={total.usdc}
            isFree={totalFio === 0}
          />
        }
      />
    );
  };

  const bundlesRender = () => {
    if (!bundles) {
      return null;
    }

    return (
      <TransactionDetailsItem
        position={valuePosition}
        name="Bundled Transaction Amount"
        value={
          <>
            <span className={classnames(classes.value)}>
              {bundles.fee} Bundles&nbsp;
            </span>
            {bundles.remaining && (
              <span className={classes.remaining}>
                ({bundles.remaining} Remaining)
              </span>
            )}
          </>
        }
      />
    );
  };

  const payWithRender = () => {
    if (!payWith) {
      return null;
    }

    return (
      <TransactionDetailsItem
        position={valuePosition}
        name="Paying With"
        value={
          <PayWalletInfo
            walletName={payWith.walletName}
            fioBalance={payWith.walletBalances.fio}
            usdcBalance={payWith.walletBalances.usdc}
          />
        }
      />
    );
  };

  const additionalRender = () => {
    if (additional.length === 0) {
      return null;
    }

    return (
      <>
        {additional
          .filter(it => !it.hide)
          .map(({ label, value, link, wrap }) => (
            <TransactionDetailsItem
              key={`${label}-${value}`}
              position={valuePosition}
              name={label}
              value={
                link ? (
                  <a href={link} target="_blank" rel="noreferrer">
                    <span
                      className={classnames(
                        classes.value,
                        wrap && classes.wrap,
                      )}
                    >
                      {value}
                    </span>
                  </a>
                ) : (
                  <span
                    className={classnames(classes.value, wrap && classes.wrap)}
                  >
                    {value}
                  </span>
                )
              }
            />
          ))}
      </>
    );
  };

  return (
    <Badge type={BADGE_TYPES.SIMPLE} show className={className}>
      <div className={classes.wrapper}>
        {feeRender()}
        {totalRender()}
        {bundlesRender()}
        {payWithRender()}
        {additionalRender()}
      </div>
    </Badge>
  );
};

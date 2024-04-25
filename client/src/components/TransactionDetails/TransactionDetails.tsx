import { FC } from 'react';

import { useSelector } from 'react-redux';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import { PriceComponent } from '../PriceComponent';

import { TransactionDetailsItem } from './components/TransactionDetailsItem';

import { convertFioPrices } from '../../util/prices';

import classes from './TransactionDetails.module.scss';
import { roe as roeSelector } from '../../redux/registrations/selectors';

type Props = {
  feeInFio?: number;
  amountInFio?: number;
  bundles?: {
    fee: number;
    remaining: number;
  };
};

export const TransactionDetails: FC<Props> = ({
  feeInFio,
  amountInFio,
  bundles,
}) => {
  const roe = useSelector(roeSelector);

  const feeRender = () => {
    if (!!bundles || typeof feeInFio !== 'number') {
      return null;
    }

    const fee = convertFioPrices(feeInFio, roe);

    return (
      <TransactionDetailsItem
        name="Transaction Fee"
        value={
          <PriceComponent
            costFio={fee.fio}
            costUsdc={fee.usdc}
            isFree={feeInFio === 0}
          />
        }
      />
    );
  };

  const totalRender = () => {
    if (
      !!bundles ||
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
        name="Bundle Fee"
        value={
          <>
            <span className="boldText">{bundles.fee} Bundles&nbsp;</span>
            <span className={classes.remaining}>
              ({bundles.remaining} Remaining)
            </span>
          </>
        }
      />
    );
  };

  return (
    <Badge type={BADGE_TYPES.SIMPLE} show>
      <div className={classes.wrapper}>
        {feeRender()}
        {totalRender()}
        {bundlesRender()}
      </div>
    </Badge>
  );
};

import React from 'react';

import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';

import { Prices } from '../../types';

type Props = {
  isDomainPrice?: null | boolean;
  prices: Prices;
  isFree: boolean;
  isDomain: boolean;
  hasCustomDomain: boolean;
  hasCurrentDomain: boolean;
  roe: number;
};

const PriceComponent: React.FC<Props> = props => {
  const {
    isDomainPrice = null,
    prices,
    isFree,
    isDomain,
    hasCustomDomain,
    hasCurrentDomain,
    roe,
  } = props;

  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  let costNativeFio;
  let costFio;
  let costUsdc;

  if (!isFree && !isDomain) {
    costNativeFio = nativeFioAddressPrice;
    const fioPrices = convertFioPrices(costNativeFio, roe);
    costFio = fioPrices.fio;
    costUsdc = fioPrices.usdc;
  }
  if (hasCustomDomain) {
    costNativeFio =
      costNativeFio != null
        ? new MathOp(costNativeFio).add(nativeFioDomainPrice).toNumber()
        : nativeFioDomainPrice;
    const fioPrices = convertFioPrices(costNativeFio, roe);
    costFio = fioPrices.fio;
    costUsdc = fioPrices.usdc;
  }

  const price = isFree ? 'FREE' : `${costFio} FIO (${costUsdc} USDC)`;

  const cost = `Cost: ${price}`;

  return (
    <>{isDomainPrice && !hasCustomDomain && hasCurrentDomain ? null : cost}</>
  );
};

export default PriceComponent;

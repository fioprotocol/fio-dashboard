import React from 'react';

import { PriceComponent } from '../../../components/PriceComponent';

import apis from '../../../api';
import MathOp from '../../../util/math';

type AmountProps = {
  roe: string;
  total: string;
};

export const OrderItemAmount: React.FC<AmountProps> = props => {
  const { roe, total } = props;

  const isFree = total === '0' || total == null;

  const costFio = apis.fio
    .convertUsdcToFio(
      new MathOp(total || 0).toNumber(),
      roe && new MathOp(roe).toNumber(),
    )
    .toFixed(2);

  return <PriceComponent costFio={costFio} costUsdc={total} isFree={isFree} />;
};

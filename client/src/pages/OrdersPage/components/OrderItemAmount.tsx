import React from 'react';

import apis from '../../../api';
import MathOp from '../../../util/math';

type AmountProps = {
  roe: string;
  showFioPrice?: boolean;
  total: string;
};

export const OrderItemAmount: React.FC<AmountProps> = props => {
  const { roe, showFioPrice, total } = props;

  if (total === '0') return <>FREE</>;

  let amount = `${total} USDC`;

  if (showFioPrice) {
    const fioAmount = apis.fio
      .convertUsdcToFio(
        new MathOp(total).toNumber(),
        new MathOp(roe).toNumber(),
      )
      .toFixed(2);

    amount += ` (${fioAmount} FIO)`;
  }

  return <>{amount}</>;
};

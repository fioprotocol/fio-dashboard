import React from 'react';

import { PriceComponent } from '../../../components/PriceComponent';

import apis from '../../../api';
import { Roe } from '../../../types';

type AmountProps = {
  roe: Roe;
  total: string;
};

export const OrderItemAmount: React.FC<AmountProps> = props => {
  const { roe, total } = props;

  const isFree = total === '0' || total == null;

  const costFio = apis.fio.convertUsdcToFio(total || '0', roe);

  return <PriceComponent costFio={costFio} costUsdc={total} isFree={isFree} />;
};

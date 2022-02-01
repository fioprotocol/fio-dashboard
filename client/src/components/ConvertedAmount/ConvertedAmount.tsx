import React from 'react';

import { useConvertFioToUsdc } from '../../util/hooks';

type Props = {
  fioAmount?: number;
  nativeAmount?: number;
};

const ConvertedAmount: React.FC<Props> = props => {
  const { fioAmount, nativeAmount } = props;

  const usdcPrice = useConvertFioToUsdc({ fioAmount, nativeAmount });

  if (!usdcPrice) return null;

  return <span>$ {usdcPrice} USDC</span>;
};

export default ConvertedAmount;

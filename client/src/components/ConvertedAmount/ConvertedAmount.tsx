import React from 'react';

import Amount from '../common/Amount';

import { useConvertFioToUsdc } from '../../util/hooks';

type Props = {
  fioAmount?: number;
  nativeAmount?: number;
};

const ConvertedAmount: React.FC<Props> = props => {
  const { fioAmount, nativeAmount } = props;

  const usdcPrice = useConvertFioToUsdc({
    fioAmount,
    nativeAmount,
  });

  if (!usdcPrice) return null;

  return (
    <span>
      $<Amount value={usdcPrice} />
    </span>
  );
};

export default ConvertedAmount;

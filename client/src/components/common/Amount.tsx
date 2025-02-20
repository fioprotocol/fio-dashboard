import React from 'react';

import MathOp from '../../util/math';

const formatLocale = (value: number | string | object) => {
  if (typeof value === 'object') {
    value = value.toString();
  }

  try {
    return new MathOp(value || 0)
      .round(2)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  } catch {
    return '-';
  }
};

const Amount: React.FC<{ value?: number | string }> = ({ value, children }) => {
  return <>{formatLocale(value || children || 0)}</>;
};

export default Amount;

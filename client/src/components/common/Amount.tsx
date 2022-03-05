import React from 'react';

import { US_LOCALE } from '../../constants/common';

const Amount: React.FC<{ value?: number | string }> = ({ value, children }) => {
  return <>{Number(value || children || 0).toLocaleString(US_LOCALE)}</>;
};

export default Amount;

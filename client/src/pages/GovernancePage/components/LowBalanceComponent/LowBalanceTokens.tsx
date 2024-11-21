import React from 'react';

import { LowBalanceComponent } from './LowBalanceComponent';
import { LowBalanceProps } from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';

export const LowBalanceTokens: React.FC<LowBalanceProps> = props => {
  return (
    <LowBalanceComponent
      {...props}
      title="Cannot Cast Vote"
      messageText="Your wallet has no voting power due to a token balance of zero. Please deposit tokens or add a wallet with a token balance to your account"
    />
  );
};

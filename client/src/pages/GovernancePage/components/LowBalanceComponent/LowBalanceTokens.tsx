import React from 'react';

import { LowBalanceComponent } from './LowBalanceComponent';
import { LowBalanceProps } from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';

export const LowBalanceTokens: React.FC<LowBalanceProps> = props => {
  return (
    <LowBalanceComponent
      {...props}
      title="Cannot Cast Vote"
      messageText="This wallet has no voting power due to a token balance of zero. Please deposit tokens or choose a different wallet in order to vote."
    />
  );
};

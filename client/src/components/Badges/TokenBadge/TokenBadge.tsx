import React from 'react';

import { useCheckIfDesktop } from '../../../screenType';
import TokenBadgeDesktop from './TokenBadgeDesktop';
import TokenBadgeMobile from './TokenBadgeMobile';

import { TokenBadgeProps } from './types';

const TokenBadge: React.FC<TokenBadgeProps> = props => {
  const isDesktop = useCheckIfDesktop();

  return isDesktop ? (
    <TokenBadgeDesktop {...props} />
  ) : (
    <TokenBadgeMobile {...props} />
  );
};

export default TokenBadge;

import React from 'react';
import { useCheckIfDesktop } from '../../../screenType';
import TokenBadgeDesktop from './TokenBadgeDesktop';
import TokenBadgeMobile from './TokenBadgeMobile';

import { PublicAddressDoublet } from '../../../types';

type Props = {
  actionButton?: React.ReactNode;
  input?: React.ReactNode;
  showInput?: boolean;
} & PublicAddressDoublet;

const TokenBadge: React.FC<Props> = props => {
  const isDesktop = useCheckIfDesktop();

  return isDesktop ? (
    <TokenBadgeDesktop {...props} />
  ) : (
    <TokenBadgeMobile {...props} />
  );
};

export default TokenBadge;

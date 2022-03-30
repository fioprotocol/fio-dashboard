import React from 'react';

import { PublicAddressDoublet } from '../../../types';

export type TokenBadgeProps = {
  actionButton?: React.ReactNode;
  input?: React.ReactNode;
  showInput?: boolean;
  isBold?: boolean;
} & PublicAddressDoublet;

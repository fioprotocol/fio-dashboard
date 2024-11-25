import React from 'react';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { WarningNotificationBadge } from '../WarningNotificationBadge/WarningNotificationBadge';

type Props = {
  show: boolean;
};

export const NotUsingFioHandlesWarningBadge: React.FC<Props> = props => (
  <WarningNotificationBadge
    show={props.show}
    title="Not Using a FIO Handles"
    type={BADGE_TYPES.ERROR}
    message={
      <>
        You may still vote without using a handle, but you will pay a small fee
        to complete this request. See Transaction Fees Below.
      </>
    }
  />
);

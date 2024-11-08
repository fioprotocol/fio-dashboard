import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../../constants/routes';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { WarningNotificationBadge } from '../WarningNotificationBadge/WarningNotificationBadge';

type Props = {
  customMessage?: string;
  show: boolean;
};

export const NoAssociatedFioHandlesWarningBadge: React.FC<Props> = props => (
  <WarningNotificationBadge
    show={props.show}
    title="No Associated FIO Handles"
    type={BADGE_TYPES.ERROR}
    message={
      props.customMessage ? (
        props.customMessage
      ) : (
        <>
          You must have an associated FIO Handle in order to be able to send
          this request.{' '}
          <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>Please add one.</Link>
        </>
      )
    }
  />
);

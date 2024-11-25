import React from 'react';
import { Link } from 'react-router-dom';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { WarningNotificationBadge } from '../WarningNotificationBadge/WarningNotificationBadge';

type Props = {
  show: boolean;
  returnLink: string;
};

export const NoCandidatesWarningBadge: React.FC<Props> = props => (
  <WarningNotificationBadge
    show={props.show}
    title="No Candidates"
    type={BADGE_TYPES.ERROR}
    message={
      <>
        No Candidates - You must vote for at least one candidate. Please return
        to the <Link to={props.returnLink}>prior view</Link> to add candidates.
      </>
    }
  />
);

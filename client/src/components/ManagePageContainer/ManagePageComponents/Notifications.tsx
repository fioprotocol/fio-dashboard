import React from 'react';

import NotificationBadge from '../../NotificationBadge';
import { BADGE_TYPES } from '../../Badge/Badge';
import { BANNER_DATA } from '../constants';

import { NotificationsProps } from '../types';

const Notifications: React.FC<NotificationsProps> = props => {
  const {
    showWarnBadge,
    showInfoBadge,
    toggleShowWarnBadge,
    toggleShowInfoBadge,
    pageName,
  } = props;
  const { warningTitle, warningMessage, infoTitle, infoMessage } = BANNER_DATA[
    pageName
  ];
  return (
    <>
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={warningTitle}
        message={warningMessage}
        show={showWarnBadge}
        onClose={() => toggleShowWarnBadge(false)}
      />
      <NotificationBadge
        type={BADGE_TYPES.INFO}
        title={infoTitle}
        message={infoMessage}
        show={showInfoBadge}
        onClose={() => toggleShowInfoBadge(false)}
      />
    </>
  );
};

export default Notifications;

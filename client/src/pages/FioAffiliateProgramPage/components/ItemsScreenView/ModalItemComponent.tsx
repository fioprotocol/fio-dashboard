import React, { useCallback, useState } from 'react';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import DomainStatusBadge from '../../../../components/Badges/DomainStatusBadge/DomainStatusBadge';
import NotificationBadge from '../../../../components/NotificationBadge';

import { DomainActionButtons } from './ActionButtons';
import { DateComponent } from '../../../../components/ManagePageContainer/components/DateComponent';

import {
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../../../util/fio';

import { DOMAIN_STATUS } from '../../../../constants/common';
import { WARNING_CONTENT as WARGNING_CONTENT_DOMAINS } from '../../../../pages/FioDomainManagePage/constants';

import { FioDomainSelectable } from '../../types';

import classes from '../../../../components/ManagePageContainer/components/ItemCopmonent/ItemComponent.module.scss';

type DomainItemComponentProps = {
  fioDomain: FioDomainSelectable;
  isDesktop?: boolean;
  onRenewDomain: (name: string) => void;
  onVisibilityChange: (name: string) => void;
};

export const DomainItemComponent: React.FC<DomainItemComponentProps> = props => {
  const { fioDomain, isDesktop, onRenewDomain, onVisibilityChange } = props;

  const { name = '', expiration, isPublic } = fioDomain || {};

  const isExpired = isDomainExpired(name, expiration);
  const isExpiredIn30Days = isDomainWillExpireIn30Days(name, expiration);

  const [showWarning, toggleShowWarning] = useState(
    expiration && (isExpired || isExpiredIn30Days),
  );

  const closeWarning = useCallback(() => toggleShowWarning(false), []);

  const warningContent = isExpired
    ? WARGNING_CONTENT_DOMAINS.DOMAIN_RENEW
    : isExpiredIn30Days
    ? WARGNING_CONTENT_DOMAINS.DOMAIN_RENEW_IN_30_DAYS
    : null;

  return (
    <div className="w-100">
      <h4 className={classes.title}>FIO Domain Details</h4>
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={warningContent?.title}
        message={warningContent?.message}
        show={showWarning}
        onClose={closeWarning}
      />
      <div className={classes.itemNameContainer}>
        <h4 className={classes.itemName}>
          <span className="boldText">{name}</span>
        </h4>
      </div>
      <Badge show type={BADGE_TYPES.WHITE} className={classes.badgeContainer}>
        <p className={classes.badgeTitle}>Expiration Date</p>
        <p className={classes.badgeItem}>
          <DateComponent
            expiration={expiration}
            isExpired={isExpired}
            isExpiredIn30Days={isExpiredIn30Days}
          />
        </p>
      </Badge>
      <Badge show type={BADGE_TYPES.WHITE} className={classes.badgeContainer}>
        <p className={classes.badgeTitle}>Status</p>
        <DomainStatusBadge
          status={isPublic ? DOMAIN_STATUS.PUBLIC : DOMAIN_STATUS.PRIVATE}
        />
      </Badge>
      <div className={classes.itemActions}>
        <h4 className={classes.actionsTitle}>Actions</h4>
        <DomainActionButtons
          fioDomain={fioDomain}
          isDesktop={isDesktop}
          isExpired={isExpired}
          onRenewDomain={onRenewDomain}
          onVisibilityChange={onVisibilityChange}
        />
      </div>
    </div>
  );
};

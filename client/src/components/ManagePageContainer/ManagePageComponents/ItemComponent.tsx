import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import DomainStatusBadge from '../../Badges/DomainStatusBadge/DomainStatusBadge';

import Notifications from './Notifications';
import DateComponent from './DateComponent';
import ActionButtons, { RenderAddBundles } from './ActionButtons';

import { DOMAIN_STATUS } from '../../../constants/common';
import { fioNameLabels } from '../../../constants/labels';

import { ItemComponentProps, NotificationsProps } from '../types';

import classes from './ItemComponent.module.scss';

type Props = ItemComponentProps & NotificationsProps;

const ItemComponent: React.FC<Props> = props => {
  const {
    fioNameItem,
    showWarnBadge,
    showInfoBadge,
    toggleShowWarnBadge,
    toggleShowInfoBadge,
    pageName,
    isExpired,
    isDesktop,
    onSettingsOpen,
    showExpired,
    showStatus,
    showBundles,
  } = props;
  const { name = '', remaining, expiration, isPublic } = fioNameItem || {};

  return (
    <div className={classes.itemContainer}>
      <h4 className={classes.title}>{fioNameLabels[pageName]} Details</h4>
      <Notifications
        showWarnBadge={showWarnBadge}
        showInfoBadge={showInfoBadge}
        toggleShowWarnBadge={toggleShowWarnBadge}
        toggleShowInfoBadge={toggleShowInfoBadge}
        pageName={pageName}
      />
      <div className={classes.itemNameContainer}>
        <h4 className={classes.itemName}>
          {pageName && <span className="boldText">{name}</span>}
        </h4>
        {showInfoBadge && (
          <FontAwesomeIcon
            icon="exclamation-triangle"
            className={classes.infoIcon}
            onClick={() => toggleShowInfoBadge(true)}
          />
        )}
      </div>
      <Badge show={showExpired} type={BADGE_TYPES.WHITE}>
        <p className={classes.badgeTitle}>Expiration Date</p>
        <p className={classes.badgeItem}>
          <DateComponent
            expiration={expiration}
            isExpired={isExpired}
            toggleShowWarnBadge={toggleShowWarnBadge}
          />
        </p>
      </Badge>
      <Badge show={showBundles} type={BADGE_TYPES.WHITE}>
        <div className="d-flex align-items-center w-100">
          <p className={classes.badgeTitle}>Bundled Transactions</p>
          <p className={classes.badgeItem}>{remaining || 0}</p>
          <RenderAddBundles name={name} isMobileView={true} />
        </div>
      </Badge>
      <Badge show={showStatus} type={BADGE_TYPES.WHITE}>
        <div className={classes.domainStatus}>
          <p className={classes.badgeTitle}>Status</p>
          <div className={classes.domainStatusBadge}>
            <DomainStatusBadge
              status={isPublic ? DOMAIN_STATUS.PUBLIC : DOMAIN_STATUS.PRIVATE}
            />
          </div>
        </div>
      </Badge>
      <div className={classes.itemActions}>
        <h4 className={classes.actionsTitle}>Actions</h4>
        <ActionButtons
          pageName={pageName}
          isDesktop={isDesktop}
          onSettingsOpen={onSettingsOpen}
          fioNameItem={fioNameItem}
        />
      </div>
    </div>
  );
};

export default ItemComponent;

import React, { useCallback, useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import DomainStatusBadge from '../../../Badges/DomainStatusBadge/DomainStatusBadge';
import NotificationBadge from '../../../NotificationBadge';

import {
  FchActionButtons,
  AddBundlesActionButton,
  DomainActionButtons,
} from '../ActionButtons';
import { DateComponent } from '../DateComponent';

import { isDomainExpired } from '../../../../util/fio';

import { DOMAIN_STATUS } from '../../../../constants/common';
import { LOW_BUNDLES_THRESHOLD } from '../../../../constants/fio';

import { FioNameItemProps } from '../../../../types';

import classes from './ItemComponent.module.scss';

type FchItemComponentProps = {
  fioNameItem: FioNameItemProps;
  warningContent: {
    title: string;
    message: string;
  };
  onAddBundles: (name: string) => void;
  onSettingsOpen: (data: FioNameItemProps) => void;
};

type DomainItemComponentProps = {
  fioNameItem: FioNameItemProps;
  isDesktop?: boolean;
  isDomainWatchlist?: boolean;
  warningContent: {
    title: string;
    message: string;
  };
  onRenewDomain: (name: string) => void;
  onSettingsOpen: (data: FioNameItemProps) => void;
};

export const FchItemComponent: React.FC<FchItemComponentProps> = props => {
  const { fioNameItem, warningContent, onAddBundles, onSettingsOpen } = props;

  const { name = '', remaining } = fioNameItem || {};

  const [showWarning, toggleShowWarning] = useState(
    remaining < LOW_BUNDLES_THRESHOLD,
  );

  const closeWarning = useCallback(() => toggleShowWarning(false), []);

  return (
    <div className={classes.itemContainer}>
      <h4 className={classes.title}>FIO Crypto Handle Details</h4>
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={warningContent.title}
        message={warningContent.message}
        show={showWarning}
        onClose={closeWarning}
      />
      <div className={classes.itemNameContainer}>
        <h4 className={classes.itemName}>
          <span className="boldText">{name}</span>
        </h4>
      </div>
      <Badge show type={BADGE_TYPES.WHITE}>
        <div className="d-flex align-items-center w-100">
          <p className={classes.badgeTitle}>Bundled Transactions</p>
          <p className={classes.badgeItem}>{remaining || 0}</p>
          {showWarning && <WarningIcon className={classes.warnIcon} />}
          <AddBundlesActionButton
            isMobileView
            name={name}
            onAddBundles={onAddBundles}
          />
        </div>
      </Badge>
      <div className={classes.itemActions}>
        <h4 className={classes.actionsTitle}>Actions</h4>
        <FchActionButtons
          fioNameItem={fioNameItem}
          onSettingsOpen={onSettingsOpen}
        />
      </div>
    </div>
  );
};

export const DomainItemComponent: React.FC<DomainItemComponentProps> = props => {
  const {
    fioNameItem,
    isDesktop,
    isDomainWatchlist,
    warningContent,
    onRenewDomain,
    onSettingsOpen,
  } = props;

  const { name = '', expiration, isPublic } = fioNameItem || {};

  const [showWarning, toggleShowWarning] = useState(
    expiration && isDomainExpired(name, expiration),
  );

  const closeWarning = useCallback(() => toggleShowWarning(false), []);

  return (
    <div className={classes.itemContainer}>
      <h4 className={classes.title}>FIO Domain Details</h4>
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={warningContent.title}
        message={warningContent.message}
        show={showWarning}
        onClose={closeWarning}
      />
      <div className={classes.itemNameContainer}>
        <h4 className={classes.itemName}>
          <span className="boldText">{name}</span>
        </h4>
      </div>
      <Badge show type={BADGE_TYPES.WHITE}>
        <p className={classes.badgeTitle}>Expiration Date</p>
        <p className={classes.badgeItem}>
          <DateComponent domainName={name} expiration={expiration} />
        </p>
      </Badge>
      <Badge show type={BADGE_TYPES.WHITE}>
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
        <DomainActionButtons
          fioNameItem={fioNameItem}
          isDesktop={isDesktop}
          isDomainWatchlist={isDomainWatchlist}
          onRenewDomain={onRenewDomain}
          onSettingsOpen={onSettingsOpen}
        />
      </div>
    </div>
  );
};

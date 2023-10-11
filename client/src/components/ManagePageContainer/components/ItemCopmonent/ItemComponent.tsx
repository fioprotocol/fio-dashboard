import React, { useCallback, useEffect, useState } from 'react';
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

import {
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../../../util/fio';
import apis from '../../../../api';
import { log } from '../../../../util/general';
import { FIO_ADDRESS_DELIMITER } from '../../../../utils';

import { DOMAIN_STATUS } from '../../../../constants/common';
import { LOW_BUNDLES_THRESHOLD } from '../../../../constants/fio';
import { WARNING_CONTENT as WARGNING_CONTENT_FCH } from '../../../../pages/FioAddressManagePage/constants';
import { WARNING_CONTENT as WARGNING_CONTENT_DOMAINS } from '../../../../pages/FioDomainManagePage/constants';

import { FioNameItemProps } from '../../../../types';

import classes from './ItemComponent.module.scss';

type FchItemComponentProps = {
  fioNameItem: FioNameItemProps;
  onAddBundles: (name: string) => void;
  onSettingsOpen: ({
    fioNameItem,
    isExpired,
  }: {
    fioNameItem: FioNameItemProps;
    isExpired?: boolean;
  }) => void;
};

type DomainItemComponentProps = {
  fioNameItem: FioNameItemProps;
  isDesktop?: boolean;
  isDomainWatchlist?: boolean;
  onRenewDomain: (name: string) => void;
  onSettingsOpen: ({
    fioNameItem,
    isExpired,
  }: {
    fioNameItem: FioNameItemProps;
    isExpired?: boolean;
  }) => void;
};

export const FchItemComponent: React.FC<FchItemComponentProps> = props => {
  const { fioNameItem, onAddBundles, onSettingsOpen } = props;

  const { name = '', remaining } = fioNameItem || {};

  const domainName = name ? name.split(FIO_ADDRESS_DELIMITER)[1] : '';

  const [domainExpiration, setDomainExpiration] = useState<number | null>(null);

  const getDomainExpiration = useCallback(async () => {
    try {
      const { expiration } = (await apis.fio.getFioDomain(domainName)) || {};

      if (expiration) {
        setDomainExpiration(expiration);
      }
    } catch (err) {
      log.error(err);
    }
  }, [domainName]);

  const isExpired = domainExpiration && isDomainExpired(name, domainExpiration);

  const [showFchLowBundlesWarning, toggleShowFchLowBundlesWarning] = useState<
    boolean
  >(remaining < LOW_BUNDLES_THRESHOLD);

  const [showExpiredDomainWarning, toggleShowExpiredDomainWarning] = useState<
    boolean
  >(isExpired);

  const closeExpiredDomainWarning = useCallback(
    () => toggleShowExpiredDomainWarning(false),
    [],
  );

  const closeFchLowBundlesWarning = useCallback(
    () => toggleShowFchLowBundlesWarning(false),
    [],
  );

  useEffect(() => {
    getDomainExpiration();
  }, [getDomainExpiration]);

  useEffect(() => {
    toggleShowExpiredDomainWarning(!!isExpired);
  }, [isExpired]);

  return (
    <div className={classes.itemContainer}>
      <h4 className={classes.title}>FIO Handle Details</h4>
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={WARGNING_CONTENT_FCH.LOW_BUNDLES.title}
        message={WARGNING_CONTENT_FCH.LOW_BUNDLES.message}
        show={showFchLowBundlesWarning}
        onClose={closeFchLowBundlesWarning}
      />
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={WARGNING_CONTENT_FCH.EXPIRED_DOMAINS.title}
        message={WARGNING_CONTENT_FCH.EXPIRED_DOMAINS.message}
        show={showExpiredDomainWarning}
        onClose={closeExpiredDomainWarning}
      />

      <div className={classes.itemNameContainer}>
        <h4 className={classes.itemName}>
          <span className="boldText">{name}</span>
        </h4>
      </div>
      <Badge show type={BADGE_TYPES.WHITE} className={classes.badgeContainer}>
        <p className={classes.badgeTitle}>Bundled Transactions</p>
        <p className={classes.badgeItem}>{remaining || 0}</p>
        {(showFchLowBundlesWarning || showExpiredDomainWarning) && (
          <WarningIcon className={classes.warnIcon} />
        )}
        <AddBundlesActionButton
          isExpired={isExpired}
          isMobileView
          name={name}
          onAddBundles={onAddBundles}
        />
      </Badge>
      <div className={classes.itemActions}>
        <h4 className={classes.actionsTitle}>Actions</h4>
        <FchActionButtons
          fioNameItem={fioNameItem}
          isExpired={isExpired}
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
    onRenewDomain,
    onSettingsOpen,
  } = props;

  const { name = '', expiration, isPublic } = fioNameItem || {};

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
    <div className={classes.itemContainer}>
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
          fioNameItem={fioNameItem}
          isDesktop={isDesktop}
          isDomainWatchlist={isDomainWatchlist}
          isExpired={isExpired}
          onRenewDomain={onRenewDomain}
          onSettingsOpen={onSettingsOpen}
        />
      </div>
    </div>
  );
};

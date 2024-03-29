import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import WarningIcon from '@mui/icons-material/Warning';

import { DateComponent } from '../DateComponent';
import {
  AddBundlesActionButton,
  FchActionButtons,
  DomainActionButtons,
} from '../ActionButtons';
import { FioAddress } from '../FioAddress';

import DomainStatusBadge from '../../../Badges/DomainStatusBadge/DomainStatusBadge';

import { TABLE_HEADERS_LIST } from '../../constants';
import { DOMAIN_STATUS } from '../../../../constants/common';
import { LOW_BUNDLES_THRESHOLD } from '../../../../constants/fio';

import {
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../../../util/fio';

import apis from '../../../../api';
import { log } from '../../../../util/general';
import { FIO_ADDRESS_DELIMITER } from '../../../../utils';

import { ModalOpenActionType } from '../../types';
import { FioNameItemProps, FioNameType } from '../../../../types';

import classes from './UIView.module.scss';

type ItemComponentProps = {
  fioNameItem: FioNameItemProps;
  isDesktop?: boolean;
  isDomainWatchlist?: boolean;
  onSettingsOpen: ({
    fioNameItem,
    isExpired,
  }: {
    fioNameItem: FioNameItemProps;
    isExpired?: boolean;
  }) => void;
};

type DesktopViewProps = {
  fioNameList: FioNameItemProps[];
  isAddress?: boolean;
  isDesktop?: boolean;
  isDomainWatchlist?: boolean;
  pageName: FioNameType;
  onSettingsOpen: ModalOpenActionType;
  onAddBundles?: (name: string) => void;
  onRenewDomain?: (name: string) => void;
};

const AddressItemComponent: React.FC<ItemComponentProps & {
  onAddBundles: (name: string) => void;
}> = props => {
  const { fioNameItem, onAddBundles, onSettingsOpen } = props;
  const { name = '', remaining } = fioNameItem;

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

  const isExpired =
    domainExpiration && isDomainExpired(domainName, domainExpiration);

  useEffect(() => {
    getDomainExpiration();
  }, [getDomainExpiration]);

  return (
    <React.Fragment key={name}>
      <div className={classnames(classes.tableCol, classes.firstCol)}>
        <FioAddress name={name} />
      </div>
      <div className={classes.tableCol}>
        {remaining || remaining === 0 ? (
          <span className={classes.remaining}>{remaining}</span>
        ) : (
          '-'
        )}
        {(remaining < LOW_BUNDLES_THRESHOLD || isExpired) && (
          <WarningIcon
            className={classnames(
              classes.warnIcon,
              `${remaining}`.length >= 3 && classes.longNumber,
            )}
          />
        )}
        <AddBundlesActionButton
          isExpired={isExpired}
          name={fioNameItem.name || ''}
          onAddBundles={onAddBundles}
        />
      </div>
      <div className={classnames(classes.tableCol, classes.lastCol)}>
        <FchActionButtons
          fioNameItem={fioNameItem}
          isExpired={isExpired}
          onSettingsOpen={onSettingsOpen}
        />
      </div>
    </React.Fragment>
  );
};

const DomainItemComponent: React.FC<ItemComponentProps & {
  onRenewDomain: (name: string) => void;
}> = props => {
  const {
    fioNameItem,
    isDesktop,
    isDomainWatchlist,
    onSettingsOpen,
    onRenewDomain,
  } = props;
  const { name, isPublic, expiration } = fioNameItem;

  const isExpired = isDomainExpired(name, expiration);
  const isExpiredIn30Days = isDomainWillExpireIn30Days(name, expiration);

  return (
    <React.Fragment key={name}>
      <div className={classnames(classes.tableCol, classes.firstCol)}>
        <div className={classes.nameContainer}>
          <p className={classes.name}>{name}</p>
        </div>
      </div>
      <div className={classes.tableCol}>
        <DomainStatusBadge
          status={isPublic ? DOMAIN_STATUS.PUBLIC : DOMAIN_STATUS.PRIVATE}
        />
      </div>
      <div className={classes.tableCol}>
        <DateComponent
          expiration={expiration}
          isExpired={isExpired}
          isExpiredIn30Days={isExpiredIn30Days}
        />
      </div>
      <div className={classnames(classes.tableCol, classes.lastCol)}>
        <DomainActionButtons
          fioNameItem={fioNameItem}
          isDesktop={isDesktop}
          isDomainWatchlist={isDomainWatchlist}
          isExpired={isExpired}
          onRenewDomain={onRenewDomain}
          onSettingsOpen={onSettingsOpen}
        />
      </div>
    </React.Fragment>
  );
};

export const DesktopView: React.FC<DesktopViewProps> = props => {
  const {
    fioNameList,
    isAddress,
    isDesktop,
    isDomainWatchlist,
    pageName,
    onSettingsOpen,
    onAddBundles,
    onRenewDomain,
  } = props;

  return (
    <div
      className={classnames(classes.container, !isAddress && classes.isDomain)}
    >
      {TABLE_HEADERS_LIST[pageName].map((headerItem, index) => (
        <div
          className={classnames(
            classes.tableHeader,
            index === 0 && classes.firstHeaderCol,
          )}
          key={headerItem}
        >
          {headerItem}
        </div>
      ))}
      {fioNameList &&
        fioNameList.map(fioNameItem =>
          isAddress ? (
            <AddressItemComponent
              fioNameItem={fioNameItem}
              key={fioNameItem.name}
              onAddBundles={onAddBundles}
              onSettingsOpen={onSettingsOpen}
            />
          ) : (
            <DomainItemComponent
              fioNameItem={fioNameItem}
              isDesktop={isDesktop}
              isDomainWatchlist={isDomainWatchlist}
              key={fioNameItem.name}
              onSettingsOpen={onSettingsOpen}
              onRenewDomain={onRenewDomain}
            />
          ),
        )}
    </div>
  );
};

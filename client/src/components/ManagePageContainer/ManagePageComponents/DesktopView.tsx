import React from 'react';
import classnames from 'classnames';
import WarningIcon from '@mui/icons-material/Warning';

import DateComponent from './DateComponent';
import {
  AddBundlesActionButton,
  FchActionButtons,
  DomainActionButtons,
} from './ActionButtons';
import FioAddress from './FioAddress';

import DomainStatusBadge from '../../Badges/DomainStatusBadge/DomainStatusBadge';

import { TABLE_HEADERS_LIST } from '../constants';
import { DOMAIN_STATUS } from '../../../constants/common';
import { LOW_BUNDLES_THRESHOLD } from '../../../constants/fio';

import { ModalOpenActionType } from '../types';
import { FioNameItemProps, FioNameType } from '../../../types';

import classes from './UIView.module.scss';

type ItemComponentProps = {
  fioNameItem: FioNameItemProps;
  onSettingsOpen: (data: FioNameItemProps) => void;
};

type DesktopViewProps = {
  fioNameList: FioNameItemProps[];
  isAddress: boolean;
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
        {remaining < LOW_BUNDLES_THRESHOLD && (
          <WarningIcon className={classes.warnIcon} />
        )}
        <AddBundlesActionButton
          name={fioNameItem.name || ''}
          onAddBundles={onAddBundles}
        />
      </div>
      <div className={classnames(classes.tableCol, classes.lastCol)}>
        <FchActionButtons
          fioNameItem={fioNameItem}
          name={name}
          onSettingsOpen={onSettingsOpen}
        />
      </div>
    </React.Fragment>
  );
};

const DomainItemComponent: React.FC<ItemComponentProps & {
  onRenewDomain: (name: string) => void;
}> = props => {
  const { fioNameItem, onSettingsOpen, onRenewDomain } = props;
  const { name, isPublic, expiration } = fioNameItem;
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
        <DateComponent domainName={name} expiration={expiration} />
      </div>
      <div className={classnames(classes.tableCol, classes.lastCol)}>
        <DomainActionButtons
          fioNameItem={fioNameItem}
          name={name}
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
              onAddBundles={onAddBundles}
              onSettingsOpen={onSettingsOpen}
            />
          ) : (
            <DomainItemComponent
              fioNameItem={fioNameItem}
              onSettingsOpen={onSettingsOpen}
              onRenewDomain={onRenewDomain}
            />
          ),
        )}
    </div>
  );
};

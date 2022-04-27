import React from 'react';
import classnames from 'classnames';

import DateComponent from './DateComponent';
import ActionButtons, { RenderAddBundles } from './ActionButtons';
import FioAddress from './FioAddress';

import DomainStatusBadge from '../../Badges/DomainStatusBadge/DomainStatusBadge';

import { PAGE_NAME, TABLE_HEADERS_LIST } from '../constants';
import { DOMAIN_STATUS } from '../../../constants/common';

import { DefaultProps } from '../types';
import { FioNameItemProps } from '../../../types';

import classes from './UIView.module.scss';

const DesktopView: React.FC<DefaultProps> = props => {
  const {
    fioNameList,
    isExpired,
    pageName,
    showInfoBadge,
    toggleShowInfoBadge,
    toggleShowWarnBadge,
    isDesktop,
    onSettingsOpen,
  } = props;
  const isAddress = pageName === PAGE_NAME.ADDRESS;

  const renderAddress = (fioNameItem: FioNameItemProps) => {
    const { name = '', remaining } = fioNameItem;
    return (
      <React.Fragment key={name}>
        <div className={classnames(classes.tableCol, classes.firstCol)}>
          <FioAddress
            name={name}
            showInfoBadge={showInfoBadge}
            toggleShowInfoBadge={toggleShowInfoBadge}
          />
        </div>
        <div className={classes.tableCol}>
          {remaining || remaining === 0 ? (
            <span className={classes.remaining}>{remaining}</span>
          ) : (
            '-'
          )}
          <RenderAddBundles name={fioNameItem.name || ''} />
        </div>
        <div className={classnames(classes.tableCol, classes.lastCol)}>
          <ActionButtons
            pageName={pageName}
            isDesktop={isDesktop}
            onSettingsOpen={onSettingsOpen}
            fioNameItem={fioNameItem}
          />
        </div>
      </React.Fragment>
    );
  };

  const renderDomain = (fioNameItem: FioNameItemProps) => {
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
          <DateComponent
            expiration={expiration}
            isExpired={isExpired}
            toggleShowWarnBadge={toggleShowWarnBadge}
          />
        </div>
        <div className={classnames(classes.tableCol, classes.lastCol)}>
          <ActionButtons
            pageName={pageName}
            isDesktop={isDesktop}
            onSettingsOpen={onSettingsOpen}
            fioNameItem={fioNameItem}
          />
        </div>
      </React.Fragment>
    );
  };

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
          isAddress ? renderAddress(fioNameItem) : renderDomain(fioNameItem),
        )}
    </div>
  );
};

export default DesktopView;

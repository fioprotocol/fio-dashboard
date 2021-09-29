import React from 'react';
import classnames from 'classnames';

import DateComponent from './DateComponent';
import ActionButtons from './ActionButtons';
import FioAddress from './FioAddress';

import DomainStatusBadge from '../../Badges/DomainStatusBadge/DomainStatusBadge';

import { PAGE_NAME } from '../constants';
import { DOMAIN_STATUS } from '../../../constants/common';

import { DefaultProps } from '../types';

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
  return (
    <div className={classes.container}>
      {pageName === PAGE_NAME.ADDRESS && (
        <>
          <div
            className={classnames(classes.tableHeader, classes.firstHeaderCol)}
          >
            Address
          </div>
          <div className={classes.tableHeader}>Bundles</div>
          <div className={classes.tableHeader}>Exp. Date</div>
          <div className={classes.tableHeader}>Actions</div>
        </>
      )}
      {pageName === PAGE_NAME.DOMAIN && (
        <>
          <div
            className={classnames(classes.tableHeader, classes.firstHeaderCol)}
          >
            Domain
          </div>
          <div className={classes.tableHeader}>Status</div>
          <div className={classes.tableHeader}>Exp. Date</div>
          <div className={classes.tableHeader}>Actions</div>
        </>
      )}
      {fioNameList &&
        fioNameList.map(fioNameItem => {
          const { name, remaining, expiration, isPublic } = fioNameItem;
          if (pageName === PAGE_NAME.ADDRESS) {
            return (
              <React.Fragment key={name}>
                <div className={classnames(classes.tableCol, classes.firstCol)}>
                  <FioAddress
                    name={name}
                    showInfoBadge={showInfoBadge}
                    toggleShowInfoBadge={toggleShowInfoBadge}
                    isDesktop={isDesktop}
                  />
                </div>
                <div className={classes.tableCol}>
                  {remaining || remaining === 0 ? remaining : '-'}
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
          } else if (pageName === PAGE_NAME.DOMAIN) {
            return (
              <React.Fragment key={name}>
                <div className={classnames(classes.tableCol, classes.firstCol)}>
                  <div className={classes.nameContainer}>
                    <p className={classes.name}>{name}</p>
                  </div>
                </div>
                <div className={classes.tableCol}>
                  <DomainStatusBadge
                    status={
                      isPublic ? DOMAIN_STATUS.PUBLIC : DOMAIN_STATUS.PRIVATE
                    }
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
          }
        })}
    </div>
  );
};

export default DesktopView;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FioAddress from './FioAddress';

import { PAGE_NAME } from '../constants';

import { DefaultProps } from '../types';

import classes from './UIView.module.scss';

const MobileView: React.FC<DefaultProps> = props => {
  const {
    fioNameList,
    isExpired,
    pageName,
    showInfoBadge,
    toggleShowInfoBadge,
    toggleShowWarnBadge,
    isDesktop,
    onItemModalOpen,
  } = props;

  return (
    <div className={classes.container}>
      {pageName === PAGE_NAME.ADDRESS && (
        <h5 className={classes.tableHeader}>Addresses</h5>
      )}
      {pageName === PAGE_NAME.DOMAIN && (
        <h5 className={classes.tableHeader}>Domains</h5>
      )}
      {fioNameList &&
        fioNameList.map(fioNameItem => {
          const { name, expiration } = fioNameItem;
          return (
            <div
              className={classes.dataItemContainer}
              key={name}
              onClick={() => onItemModalOpen(fioNameItem)}
            >
              {pageName === PAGE_NAME.ADDRESS ? (
                <FioAddress
                  name={name}
                  showInfoBadge={showInfoBadge}
                  toggleShowInfoBadge={toggleShowInfoBadge}
                  isDesktop={isDesktop}
                  expiration={expiration}
                  toggleShowWarnBadge={toggleShowWarnBadge}
                  isExpired={isExpired}
                />
              ) : pageName === PAGE_NAME.DOMAIN ? (
                <span className="boldText">{name}</span>
              ) : null}
              <FontAwesomeIcon
                icon="chevron-right"
                className={classes.openIcon}
              />
            </div>
          );
        })}
    </div>
  );
};

export default MobileView;

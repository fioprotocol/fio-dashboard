import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DOMAIN_TYPE, PAGE_NAME } from './constants';
import { ComponentsType, BoolStateFunc, IsExpiredFunc } from './types';

import classes from './ManagePageComponents.module.scss';
import icon from '../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material

const renderDate = (
  expiration: Date,
  isExpired: IsExpiredFunc,
  toggleShowWarnBadge: BoolStateFunc,
) => (
  <>
    {expiration && new Date(expiration).toLocaleDateString('en-US')}{' '}
    {isExpired(expiration) && (
      <FontAwesomeIcon
        icon="exclamation-triangle"
        className={classes.warnIcon}
        onClick={() => toggleShowWarnBadge(true)}
      />
    )}
  </>
);

const renderFioAddress = (
  name: string,
  showInfoBadge: boolean,
  toggleShowInfoBadge: BoolStateFunc,
  isDesktop: boolean,
  expiration?: Date,
  toggleShowWarnBadge?: BoolStateFunc,
  isExpired?: IsExpiredFunc,
) => {
  const address = name && name.split('@');
  const addressName = address && address[0];
  const addressDomain = address && address[1];
  return (
    <div className={classes.nameContainer}>
      <p className={classes.name}>
        <span className="boldText">{addressName}</span>@{addressDomain}
      </p>
      {showInfoBadge && (
        <FontAwesomeIcon
          icon="exclamation-triangle"
          className={classes.infoIcon}
          onClick={() => toggleShowInfoBadge(true)}
        />
      )}
      {!isDesktop && isExpired(expiration) && (
        <FontAwesomeIcon
          icon="exclamation-triangle"
          className={classes.warnIcon}
          onClick={() => toggleShowWarnBadge(true)}
        />
      )}
    </div>
  );
};

// todo: set actions on buttons
const renderActions = (pageName: string) => {
  return (
    <div className={classes.actionButtonsContainer}>
      <Button className={classes.actionButton}>
        <img src={icon} alt="timelapse" /> Renew
      </Button>
      {pageName === PAGE_NAME.ADDRESS ? (
        <Button className={classes.actionButton}>
          <FontAwesomeIcon icon="link" className={classes.linkIcon} /> Link
        </Button>
      ) : (
        <Button className={classes.actionButton}>
          <FontAwesomeIcon icon="at" className={classes.atIcon} />
          Register FIO Address
        </Button>
      )}
      <Button className={classes.settingsButton}>
        <FontAwesomeIcon icon="cog" className={classes.settingsIcon} />
      </Button>
    </div>
  );
};

export const DesktopComponents: React.FC<ComponentsType> = props => {
  const {
    data,
    isExpired,
    pageName,
    showInfoBadge,
    toggleShowInfoBadge,
    toggleShowWarnBadge,
    isDesktop,
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
          <div className={classes.tableHeader}>Bundled Transactions</div>
          <div className={classes.tableHeader}>Expiration Date</div>
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
          <div className={classes.tableHeader}>Expiration Date</div>
          <div className={classes.tableHeader}>Actions</div>
        </>
      )}
      {data &&
        data.map(dataItem => {
          const { name, remaining, expiration, is_public } = dataItem;
          if (pageName === PAGE_NAME.ADDRESS) {
            return (
              <React.Fragment key={name}>
                <div className={classnames(classes.tableCol, classes.firstCol)}>
                  {renderFioAddress(
                    name,
                    showInfoBadge,
                    toggleShowInfoBadge,
                    isDesktop,
                  )}
                </div>
                <div className={classes.tableCol}>
                  <span className="boldText mr-2">{remaining || 0}</span>{' '}
                  Remaining
                </div>
                <div className={classes.tableCol}>
                  {renderDate(expiration, isExpired, toggleShowWarnBadge)}
                </div>
                <div className={classnames(classes.tableCol, classes.lastCol)}>
                  {renderActions(pageName)}
                </div>
              </React.Fragment>
            );
          } else if (pageName === PAGE_NAME.DOMAIN) {
            return (
              <React.Fragment key={name}>
                <div className={classnames(classes.tableCol, classes.firstCol)}>
                  <span className="boldText">{name}</span>
                </div>
                <div className={classes.tableCol}>
                  <div
                    className={classnames(
                      classes.domainType,
                      is_public && classes.public,
                    )}
                  >
                    {is_public ? DOMAIN_TYPE.PUBLIC : DOMAIN_TYPE.PRIVATE}
                  </div>
                </div>
                <div className={classes.tableCol}>
                  {renderDate(expiration, isExpired, toggleShowWarnBadge)}
                </div>
                <div className={classnames(classes.tableCol, classes.lastCol)}>
                  {renderActions(pageName)}
                </div>
              </React.Fragment>
            );
          }
        })}
    </div>
  );
};

export const MobileComponents: React.FC<ComponentsType> = props => {
  const {
    data,
    isExpired,
    pageName,
    showInfoBadge,
    toggleShowInfoBadge,
    toggleShowWarnBadge,
    isDesktop,
  } = props;
  return (
    <div className={classes.container}>
      {pageName === PAGE_NAME.ADDRESS && (
        <h5 className={classes.tableHeader}>Addresses</h5>
      )}
      {pageName === PAGE_NAME.DOMAIN && (
        <h5 className={classes.tableHeader}>Domains</h5>
      )}
      {data &&
        data.map(dataItem => {
          const { name, expiration } = dataItem;
          return (
            <div className={classes.itemContainer} key={name}>
              {pageName === PAGE_NAME.ADDRESS ? (
                renderFioAddress(
                  name,
                  showInfoBadge,
                  toggleShowInfoBadge,
                  isDesktop,
                  expiration,
                  toggleShowWarnBadge,
                  isExpired,
                )
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

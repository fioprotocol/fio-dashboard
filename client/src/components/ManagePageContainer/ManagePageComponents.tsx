import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { FioWalletDoublet } from '../../types';

import { BANNER_DATA, DOMAIN_TYPE, PAGE_NAME } from './constants';
import {
  DeafultProps,
  BoolStateFunc,
  IsExpiredFunc,
  ItemComponentProps,
  NotificationsProps,
  SettingsProps,
  ActionButtonProps,
} from './types';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import NotificationBadge from '../NotificationBadge';
import { capitalizeFirstLetter } from '../../utils';

import classes from './ManagePageComponents.module.scss';
import icon from '../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material
import { ROUTES } from '../../constants/routes';

export const RenderNotifications: React.FC<NotificationsProps> = props => {
  const {
    showWarnBadge,
    showInfoBadge,
    toggleShowWarnBadge,
    toggleShowInfoBadge,
    pageName,
  } = props;
  const { warningTitle, warningMessage, infoTitle, infoMessage } = BANNER_DATA[
    pageName
  ];
  return (
    <>
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={warningTitle}
        message={warningMessage}
        show={showWarnBadge}
        onClose={() => toggleShowWarnBadge(false)}
      />
      <NotificationBadge
        type={BADGE_TYPES.INFO}
        title={infoTitle}
        message={infoMessage}
        show={showInfoBadge}
        onClose={() => toggleShowInfoBadge(false)}
      />
    </>
  );
};

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
  return (
    <div className={classes.nameContainer}>
      <p className={classes.name}>{name}</p>
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
const renderActions: React.FC<ActionButtonProps> = props => {
  const { pageName, isDesktop, onSettingsOpen, data } = props;
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
          {isDesktop ? 'Register FIO Address' : 'Register Address'}
        </Button>
      )}
      <Button
        className={classes.settingsButton}
        onClick={() => onSettingsOpen(data)}
      >
        <FontAwesomeIcon icon="cog" className={classes.settingsIcon} />
      </Button>
    </div>
  );
};

export const DesktopComponents: React.FC<DeafultProps> = props => {
  const {
    data,
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
                  <p className={classes.remaining}>{remaining || 0}</p>
                </div>
                <div className={classes.tableCol}>
                  {renderDate(expiration, isExpired, toggleShowWarnBadge)}
                </div>
                <div className={classnames(classes.tableCol, classes.lastCol)}>
                  {renderActions({
                    pageName,
                    isDesktop,
                    onSettingsOpen,
                    data: dataItem,
                  })}
                </div>
              </React.Fragment>
            );
          } else if (pageName === PAGE_NAME.DOMAIN) {
            return (
              <React.Fragment key={name}>
                <div className={classnames(classes.tableCol, classes.firstCol)}>
                  {name}
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
                  {renderActions({
                    pageName,
                    isDesktop,
                    onSettingsOpen,
                    data: dataItem,
                  })}
                </div>
              </React.Fragment>
            );
          }
        })}
    </div>
  );
};

export const MobileComponents: React.FC<DeafultProps> = props => {
  const {
    data,
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
      {data &&
        data.map(dataItem => {
          const { name, expiration } = dataItem;
          return (
            <div
              className={classes.dataItemContainer}
              key={name}
              onClick={() => onItemModalOpen(dataItem)}
            >
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

export const RenderItemComponent: React.FC<ItemComponentProps &
  NotificationsProps> = props => {
  const {
    data,
    showWarnBadge,
    showInfoBadge,
    toggleShowWarnBadge,
    toggleShowInfoBadge,
    pageName,
    isExpired,
    isDesktop,
    onSettingsOpen,
  } = props;
  const { name, remaining, expiration, is_public } = data || {};
  return (
    <div className={classes.itemContainer}>
      <h4 className={classes.title}>
        {capitalizeFirstLetter(pageName)} Details
      </h4>
      {RenderNotifications({
        showWarnBadge,
        showInfoBadge,
        toggleShowWarnBadge,
        toggleShowInfoBadge,
        pageName,
      })}
      <div className={classes.itemNameContainer}>
        <h4 className={classes.itemName}>
          {pageName === PAGE_NAME.ADDRESS ? (
            <span className="boldText">{name}</span>
          ) : pageName === PAGE_NAME.DOMAIN ? (
            <span className="boldText">{name}</span>
          ) : null}
        </h4>
        {showInfoBadge && (
          <FontAwesomeIcon
            icon="exclamation-triangle"
            className={classes.infoIcon}
            onClick={() => toggleShowInfoBadge(true)}
          />
        )}
      </div>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <p className={classes.badgeTitle}>Expiration Date</p>
        <p className={classes.badgeItem}>
          {renderDate(expiration, isExpired, toggleShowWarnBadge)}
        </p>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        {pageName === PAGE_NAME.ADDRESS && (
          <>
            <p className={classes.badgeTitle}>Bundle Transactions</p>
            <p className={classes.badgeItem}>{remaining || 0}</p>
          </>
        )}
        {pageName === PAGE_NAME.DOMAIN && (
          <>
            <p className={classes.badgeTitle}>Status</p>
            <div
              className={classnames(
                classes.domainType,
                is_public && classes.public,
              )}
            >
              {is_public ? DOMAIN_TYPE.PUBLIC : DOMAIN_TYPE.PRIVATE}
            </div>
          </>
        )}
      </Badge>
      <div className={classes.itemActions}>
        <h4 className={classes.actionsTitle}>Actions</h4>
        {renderActions({
          pageName,
          isDesktop,
          onSettingsOpen,
          data,
        })}
      </div>
    </div>
  );
};

export const RenderItemSettings: React.FC<SettingsProps> = props => {
  const { data, pageName, fioWallets } = props;
  const { publicKey, name } = fioWallets.find(
    (fioWallet: FioWalletDoublet) =>
      fioWallet.publicKey === data.walletPublicKey,
  );

  const isDomain = pageName === PAGE_NAME.DOMAIN;

  return (
    <div className={classes.settingsContainer}>
      <h3 className={classes.title}>Advanced Settings</h3>
      <h5 className={classes.subtitle}>
        Domain {isDomain ? 'Access' : 'Ownership'}
      </h5>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <p className={classes.badgeTitle}>FIO Wallet</p>
        <p className={classes.badgeItem}>{name}</p>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <p className={classes.badgeTitle}>Public Key</p>
          <p className={classes.badgeItem}>{publicKey}</p>
        </div>
      </Badge>
      {isDomain && (
        <div>
          <h5 className={classes.actionTitle}>Domain Access</h5>
          <p className={classes.text}>
            If you would like your domain to be publicly giving users the
            ability to register FIO addresses on it, please set the domain to
            public.
          </p>
          <Link
            to={ROUTES.FIO_DOMAIN_STATUS_CHANGE}
            className={classes.buttonLink}
          >
            <Button className={classes.button}>Make Domain Public</Button>
          </Link>
        </div>
      )}
      <div>
        <h5 className={classes.actionTitle}>
          Transfer FIO {capitalizeFirstLetter(pageName)} Ownership
        </h5>
        <p className={classes.text}>
          Transferring your FIO {capitalizeFirstLetter(pageName)} to a new Owner
          is easy, Simply enter or paste the new owner public key, submit the
          request and verify the transaction.
        </p>
        <Link
          to={
            isDomain
              ? ROUTES.FIO_DOMAIN_OWNERSHIP
              : ROUTES.FIO_ADDRESS_OWNERSHIP
          }
          className={classes.buttonLink}
        >
          <Button className={classes.button}>Start Transfer</Button>
        </Link>
      </div>
    </div>
  );
};

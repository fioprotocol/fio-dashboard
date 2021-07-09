import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutContainer from '../LayoutContainer/LayoutContainer';
import { BADGE_TYPES } from '../Badge/Badge';
import NotificationBadge from '../NotificationBadge';
import { BANNER_DATA, DOMAIN_TYPE, PAGE_NAME } from './constants';
import ManagePageCtaBadge from './ManagePageCtaBadge';

import classes from './ManagePageContainer.module.scss';
import icon from '../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material
import classNames from 'classnames';

export type DataProps = {
  fio_address?: string;
  fio_domain?: string;

  expiration: Date;
  remaining_bundled_tx?: number;
  is_public?: number;
};

export type PageName = 'address' | 'domain';

type Props = {
  children?: React.ReactNode;
  pageName: PageName;
  data: DataProps[];
};

const isExpired = (expiration: Date) => {
  const today = new Date();
  return (
    expiration &&
    new Date(expiration) < new Date(today.setDate(today.getDate() + 30))
  );
};

const ManagePageContainer: React.FC<Props> = props => {
  const { pageName, data } = props;
  const [showWarnBadge, toggleShowWarnBadge] = useState(false);
  const [showInfoBadge, toggleShowInfoBadge] = useState(false);

  const {
    title,
    warningTitle,
    warningMessage,
    infoTitle,
    infoMessage,
  } = BANNER_DATA[pageName];

  useEffect(() => {
    toggleShowWarnBadge(data.some(dataItem => isExpired(dataItem.expiration)));
    toggleShowInfoBadge(true); // todo: set dependent on data
  }, []);

  const renderDate = (expiration: Date) => (
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

  const renderFioAddress = (fio_address: string) => {
    const address = fio_address && fio_address.split('@');
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
      </div>
    );
  };

  // todo: set actions on buttons
  const renderActions = () => (
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

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <p className={classes.subtitle}>
            Manage your addresses from one location. More helper content could
            go here ..
          </p>
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
          <Table
            className={classes.tableContainer}
            borderless={true}
            hover={true}
          >
            <thead>
              <tr>
                {pageName === PAGE_NAME.ADDRESS && (
                  <>
                    <th>Address</th>
                    <th>Bundled Transactions</th>
                    <th>Expiration Date</th>
                    <th>Actions</th>
                  </>
                )}
                {pageName === PAGE_NAME.DOMAIN && (
                  <>
                    <th>Domain</th>
                    <th>Status</th>
                    <th>Expiration Date</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map(dataItem => {
                  const {
                    fio_address,
                    fio_domain,
                    remaining_bundled_tx,
                    expiration,
                    is_public,
                  } = dataItem;
                  if (pageName === PAGE_NAME.ADDRESS) {
                    return (
                      <tr key={fio_address} className={classes.row}>
                        <td>{renderFioAddress(fio_address)}</td>
                        <td>{remaining_bundled_tx} Remaining</td>
                        <td>{renderDate(expiration)}</td>
                        <td>{renderActions()}</td>
                      </tr>
                    );
                  } else if (pageName === PAGE_NAME.DOMAIN) {
                    return (
                      <tr key={fio_domain} className={classes.row}>
                        <td>
                          <span className="boldText">{fio_domain}</span>
                        </td>
                        <td>
                          <div
                            className={classNames(
                              classes.domainType,
                              is_public && classes.public,
                            )}
                          >
                            {is_public
                              ? DOMAIN_TYPE.PUBLIC
                              : DOMAIN_TYPE.PRIVATE}
                          </div>
                        </td>
                        <td>{renderDate(expiration)}</td>
                        <td>{renderActions()}</td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </Table>
        </div>
      </LayoutContainer>
      <div className={classes.actionBadge}>
        <ManagePageCtaBadge name={pageName} />
      </div>
    </div>
  );
};

export default ManagePageContainer;

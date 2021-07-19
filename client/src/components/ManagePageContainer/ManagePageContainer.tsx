import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';

import LayoutContainer from '../LayoutContainer/LayoutContainer';
import { BADGE_TYPES } from '../Badge/Badge';
import NotificationBadge from '../NotificationBadge';
import { BANNER_DATA, DOMAIN_TYPE, PAGE_NAME, ITEMS_LIMIT } from './constants';
import ManagePageCtaBadge from './ManagePageCtaBadge';

import classes from './ManagePageContainer.module.scss';
import icon from '../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material
import classNames from 'classnames';

export type DataProps = {
  name: string;
  expiration: Date;
  remaining?: number;
  is_public?: number;
};

export type PageName = 'address' | 'domain';
export type HasMore = { [key: string]: number };
export type FetchDataFn = (
  publicKey: string,
  limit: number,
  offset: number,
) => void;

type Props = {
  children?: React.ReactNode;
  pageName: PageName;
  data: DataProps[];
  loading: boolean;
  fetchDataFn: FetchDataFn;
  fioWallets: any;
  hasMore: HasMore;
};

const isExpired = (expiration: Date) => {
  const today = new Date();
  return (
    expiration &&
    new Date(expiration) < new Date(today.setDate(today.getDate() + 30))
  );
};

const ManagePageContainer: React.FC<Props> = props => {
  const { pageName, data, fioWallets, fetchDataFn, hasMore, loading } = props;
  const [showWarnBadge, toggleShowWarnBadge] = useState(false);
  const [showInfoBadge, toggleShowInfoBadge] = useState(false);
  const [offset, changeOffset] = useState<HasMore>({});

  const fioWalletsRef = useRef(fioWallets);
  if (!isEqual(fioWallets, fioWalletsRef)) {
    fioWalletsRef.current = fioWallets;
  }

  const hasMoreItems = Object.keys(hasMore).some(key => hasMore[key] > 0);

  const {
    title,
    warningTitle,
    warningMessage,
    infoTitle,
    infoMessage,
  } = BANNER_DATA[pageName];

  const fetchData = () => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        const { publicKey } = fioWallet;
        const currentOffset = offset[publicKey] || 0;
        fetchDataFn(publicKey, Math.round(ITEMS_LIMIT), currentOffset);
        !!hasMore[publicKey] &&
          changeOffset({
            ...offset,
            [publicKey]: currentOffset + ITEMS_LIMIT,
          });
      }
    }
  };

  useEffect(() => {
    toggleShowWarnBadge(data.some(dataItem => isExpired(dataItem.expiration)));
    toggleShowInfoBadge(false); // todo: set dependent on data when move to get_pub_addresses
  }, []);

  useEffect(() => {
    if (!isEmpty(hasMore)) {
      const offsetObj: HasMore = {};

      Object.keys(hasMore).forEach(key => {
        offsetObj[key] = 0;
      });
      changeOffset(offsetObj);
    }
    fetchData();
  }, [fioWalletsRef.current]);

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMoreItems,
    onLoadMore: fetchData,
    rootMargin: '0px 0px 20px 0px',
  });

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

  const renderFioAddress = (name: string) => {
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

  const renderScroll = (children: React.ReactNode) => {
    return (
      <>
        {children}
        {(loading || Object.keys(hasMore).some(key => hasMore[key] > 0)) && (
          <div className={classes.loader} ref={sentryRef}>
            <FontAwesomeIcon
              icon="spinner"
              spin={true}
              className={classes.loaderIcon}
            />
          </div>
        )}
      </>
    );
  };

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
          <div className={classes.tableContainer}>
            {renderScroll(
              <div className={classes.infiniteScroll}>
                {pageName === PAGE_NAME.ADDRESS && (
                  <>
                    <div
                      className={classnames(
                        classes.tableHeader,
                        classes.firstHeaderCol,
                      )}
                    >
                      Address
                    </div>
                    <div className={classes.tableHeader}>
                      Bundled Transactions
                    </div>
                    <div className={classes.tableHeader}>Expiration Date</div>
                    <div className={classes.tableHeader}>Actions</div>
                  </>
                )}
                {pageName === PAGE_NAME.DOMAIN && (
                  <>
                    <div
                      className={classnames(
                        classes.tableHeader,
                        classes.firstHeaderCol,
                      )}
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
                          <div
                            className={classnames(
                              classes.tableCol,
                              classes.firstCol,
                            )}
                          >
                            {renderFioAddress(name)}
                          </div>
                          <div className={classes.tableCol}>
                            <span className="boldText mr-2">
                              {remaining || 0}
                            </span>{' '}
                            Remaining
                          </div>
                          <div className={classes.tableCol}>
                            {renderDate(expiration)}
                          </div>
                          <div
                            className={classnames(
                              classes.tableCol,
                              classes.lastCol,
                            )}
                          >
                            {renderActions()}
                          </div>
                        </React.Fragment>
                      );
                    } else if (pageName === PAGE_NAME.DOMAIN) {
                      return (
                        <React.Fragment key={name}>
                          <div
                            className={classnames(
                              classes.tableCol,
                              classes.firstCol,
                            )}
                          >
                            <span className="boldText">{name}</span>
                          </div>
                          <div className={classes.tableCol}>
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
                          </div>
                          <div className={classes.tableCol}>
                            {renderDate(expiration)}
                          </div>
                          <div
                            className={classnames(
                              classes.tableCol,
                              classes.lastCol,
                            )}
                          >
                            {renderActions()}
                          </div>
                        </React.Fragment>
                      );
                    }
                  })}
              </div>,
            )}
          </div>
        </div>
      </LayoutContainer>
      <div className={classes.actionBadge}>
        <ManagePageCtaBadge name={pageName} />
      </div>
    </div>
  );
};

export default ManagePageContainer;

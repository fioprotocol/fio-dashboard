import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Redirect } from 'react-router-dom';

import LayoutContainer from '../LayoutContainer/LayoutContainer';
import { BADGE_TYPES } from '../Badge/Badge';
import NotificationBadge from '../NotificationBadge';
import { BANNER_DATA, ITEMS_LIMIT } from './constants';
import ManagePageCtaBadge from './ManagePageCtaBadge';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import { ROUTES } from '../../constants/routes';

import { DesktopComponents, MobileComponents } from './ManagePageComponents';

import classes from './ManagePageContainer.module.scss';

import { HasMore, ContainerProps, BoolStateFunc } from './types';

const isExpired = (expiration: Date): boolean => {
  const today = new Date();
  return (
    expiration &&
    new Date(expiration) < new Date(today.setDate(today.getDate() + 30))
  );
};

const ManagePageContainer: React.FC<ContainerProps> = props => {
  const {
    pageName,
    data,
    fioWallets,
    fetchDataFn,
    hasMore,
    loading,
    isAuthenticated,
  } = props;
  const [showWarnBadge, toggleShowWarnBadge] = useState<BoolStateFunc>(false);
  const [showInfoBadge, toggleShowInfoBadge] = useState<BoolStateFunc>(false);
  const [offset, changeOffset] = useState<HasMore>({});

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

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
    toggleShowWarnBadge(
      data && data.some(dataItem => isExpired(dataItem.expiration)),
    );
    toggleShowInfoBadge(false); // todo: set dependent on data when move to get_pub_addresses
  }, [fioWalletsRef.current]);

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

  const propsToComponents = {
    data,
    isDesktop,
    pageName,
    showInfoBadge,
    isExpired,
    toggleShowInfoBadge,
    toggleShowWarnBadge,
  };

  if (!isAuthenticated) {
    return <Redirect to={{ pathname: ROUTES.HOME }} />;
  }

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <p className={classes.subtitle}>
            Manage your addresses from one location. More helper content could
            go here ..
          </p>
          {isDesktop && (
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
          )}
          <div className={classes.tableContainer}>
            {isDesktop
              ? renderScroll(<DesktopComponents {...propsToComponents} />)
              : renderScroll(<MobileComponents {...propsToComponents} />)}
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

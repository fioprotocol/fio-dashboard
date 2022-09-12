import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { Location } from 'history';
import classnames from 'classnames';

import { ROUTES, TOKENS_TAB_ROUTES } from '../../constants/routes';

import { useIsAdminRoute } from '../../hooks/admin';

import { LINK_LABELS, LINKS } from '../../constants/labels';

import classes from './Navigation.module.scss';

const userNavItems: string[] = [
  LINKS.FIO_ADDRESSES,
  LINKS.FIO_DOMAINS,
  LINKS.TOKENS,
  // comment links due to BD-2631 task
  // LINKS.FIO_REQUESTS,
  // LINKS.GOVERNANCE,
  // LINKS.PROTOCOL_UPDATES,
];

const adminNavItems: string[] = [
  LINKS.ADMIN_HOME,
  LINKS.ADMIN_ORDERS,
  LINKS.ADMIN_ACCOUNTS,
  LINKS.ADMIN_REGULAR_USERS,
  LINKS.ADMIN_USERS,
  LINKS.ADMIN_PROFILE,
];
const superAdminNavItems: string[] = [
  LINKS.ADMIN_HOME,
  LINKS.ADMIN_ORDERS,
  LINKS.ADMIN_ACCOUNTS,
  LINKS.ADMIN_REGULAR_USERS,
  LINKS.ADMIN_USERS,
  LINKS.ADMIN_PROFILE,
];

type Props = {
  isNotActiveUser: boolean;
  isContainedFlow: boolean;
  isNotActiveAdminUser: boolean;
  isOnSide?: boolean;
  isSuperAdmin: boolean;
  closeMenu?: () => void;
};

type RenderNavItemsProps = {
  navItemsList: string[];
  isOnSide?: boolean;
  closeMenu?: () => void;
};

const isActiveTab = (location: Location, navItem: string) => {
  if (ROUTES[navItem] === ROUTES.TOKENS && location?.pathname !== ROUTES.HOME) {
    const regexp = new RegExp(location?.pathname.split('/')[1]); //get first part of path /fio-wallet/ /send/ /stake/ etc
    return TOKENS_TAB_ROUTES.some(path => regexp.test(path));
  }
  return location?.pathname === ROUTES[navItem];
};

const RenderNavItems: React.FC<RenderNavItemsProps> = props => {
  const { isOnSide, closeMenu, navItemsList } = props;
  const location = useLocation();
  return (
    <>
      {navItemsList.map((item, i) => {
        const active = isActiveTab(location, item);
        return (
          <Nav.Item
            className={classnames(
              classes.sideItem,
              isOnSide && classes.isOnSide,
            )}
            key={LINK_LABELS[item]}
          >
            <Nav.Link
              as={Link}
              to={ROUTES[item]}
              className={classes.sideLink}
              data-content={LINK_LABELS[item]}
              eventKey={i}
              onClick={closeMenu}
              active={active}
            >
              {LINK_LABELS[item]}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </>
  );
};

export const Navigation: React.FC<Props> | null = props => {
  const {
    isOnSide,
    isNotActiveUser,
    isContainedFlow,
    isNotActiveAdminUser,
    isSuperAdmin,
    closeMenu,
  } = props;
  const isAdminLocation = useIsAdminRoute();

  if (isContainedFlow) return null;
  if (isNotActiveUser && isNotActiveAdminUser) return null;

  const navItemsList = !isAdminLocation
    ? userNavItems
    : isSuperAdmin
    ? superAdminNavItems
    : adminNavItems;

  return (
    <Nav
      className={classnames(classes.sideWrapper, isOnSide && classes.isOnSide)}
      defaultActiveKey={1}
    >
      <RenderNavItems
        closeMenu={closeMenu}
        navItemsList={navItemsList}
        isOnSide={isOnSide}
      />
    </Nav>
  );
};

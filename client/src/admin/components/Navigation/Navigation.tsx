import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { Location } from 'history';
import classnames from 'classnames';

import { ADMIN_ROUTES } from '../../../constants/routes';

import { LINK_LABELS, LINKS } from '../../../constants/labels';

import classes from './Navigation.module.scss';

const adminNavItems: string[] = [
  LINKS.ADMIN_HOME,
  LINKS.ADMIN_ORDERS,
  LINKS.ADMIN_ACCOUNTS,
  LINKS.ADMIN_API_URLS,
  LINKS.ADMIN_PARTNERS,
  LINKS.ADMIN_REGULAR_USERS,
  LINKS.ADMIN_USERS,
  LINKS.ADMIN_PROFILE,
  LINKS.ADMIN_DEFAULTS,
];

type Props = {
  isNotActiveAdminUser: boolean;
  isOnSide?: boolean;
  closeMenu?: () => void;
};

type RenderNavItemsProps = {
  navItemsList: string[];
  isOnSide?: boolean;
  closeMenu?: () => void;
};

const isActiveTab = (location: Location, navItem: string) => {
  return location?.pathname === ADMIN_ROUTES[navItem];
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
              to={ADMIN_ROUTES[item]}
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
  const { isOnSide, isNotActiveAdminUser, closeMenu } = props;

  if (isNotActiveAdminUser) return null;

  return (
    <Nav
      className={classnames(classes.sideWrapper, isOnSide && classes.isOnSide)}
      defaultActiveKey={1}
    >
      <RenderNavItems
        closeMenu={closeMenu}
        navItemsList={adminNavItems}
        isOnSide={isOnSide}
      />
    </Nav>
  );
};

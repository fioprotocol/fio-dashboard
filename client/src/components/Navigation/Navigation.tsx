import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { Location } from 'history';
import classnames from 'classnames';

import { ROUTES, TOKENS_TAB_ROUTES } from '../../constants/routes';
import { LINKS, LINK_LABELS } from '../../constants/labels';
import classes from './Navigation.module.scss';

const navItems: string[] = [
  LINKS.FIO_ADDRESSES,
  LINKS.FIO_DOMAINS,
  LINKS.TOKENS,
  // comment links due to BD-2631 task
  // LINKS.FIO_REQUESTS,
  // LINKS.GOVERNANCE,
  // LINKS.PROTOCOL_UPDATES,
];

type Props = {
  isNotActiveUser: boolean;
  isContainedFlow: boolean;
  isOnSide?: boolean;
  closeMenu?: () => void;
};

const isActiveTab = (location: Location, navItem: string) => {
  if (ROUTES[navItem] === ROUTES.TOKENS) {
    const regexp = new RegExp(location?.pathname.split('/')[1]); //get first part of path /fio-wallet/ /send/ /stake/ etc
    return TOKENS_TAB_ROUTES.some(path => regexp.test(path));
  }
  return location?.pathname === ROUTES[navItem];
};

export const Navigation: React.FC<Props> | null = props => {
  const { isOnSide, isNotActiveUser, isContainedFlow } = props;
  const location = useLocation();

  if (isContainedFlow) return null;
  if (isNotActiveUser) return null;

  const renderItems = () => {
    const { closeMenu } = props;
    return navItems.map((item, i) => {
      const active = isActiveTab(location, item);
      return (
        <Nav.Item
          className={classnames(classes.sideItem, isOnSide && classes.isOnSide)}
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
    });
  };

  return (
    <Nav
      className={classnames(classes.sideWrapper, isOnSide && classes.isOnSide)}
      defaultActiveKey={1}
    >
      {renderItems()}
    </Nav>
  );
};

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import classnames from 'classnames';

import { ROUTES } from '../../constants/routes';
import { LINKS, LINK_LABELS } from '../../constants/labels';
import classes from './Navigation.module.scss';
import { EdgeAccount } from 'edge-core-js';
import { RefProfile } from '../../types';

const navItems: string[] = [
  LINKS.FIO_ADDRESSES,
  LINKS.FIO_DOMAINS,
  // comment links due to BD-2631 task
  // LINKS.FIO_REQUESTS,
  // LINKS.FIO_WALLET,
  // LINKS.GOVERNANCE,
  // LINKS.PROTOCOL_UPDATES,
];

export const Navigation = (
  props: {
    account: EdgeAccount;
    refProfileInfo: RefProfile | null;
    refProfileLoading: boolean;
    isOnSide?: boolean;
    closeMenu?: () => void;
  } & RouteComponentProps,
) => {
  const { isOnSide, refProfileInfo, refProfileLoading } = props;

  if (!refProfileLoading && refProfileInfo != null) return null;

  const renderItems = () => {
    const { isOnSide, location, closeMenu } = props;
    return navItems.map((item, i) => (
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
          active={location && location.pathname === ROUTES[item]}
        >
          {LINK_LABELS[item]}
        </Nav.Link>
      </Nav.Item>
    ));
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

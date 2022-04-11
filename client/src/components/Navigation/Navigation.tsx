import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import classnames from 'classnames';

import { ROUTES } from '../../constants/routes';
import { LINKS, LINK_LABELS } from '../../constants/labels';
import classes from './Navigation.module.scss';
import { RefProfile } from '../../types';

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
  refProfileInfo: RefProfile | null;
  refProfileLoading: boolean;
  isNotActiveUser: boolean;
  isOnSide?: boolean;
  closeMenu?: () => void;
};

export const Navigation: React.FC<Props> = props => {
  const {
    isOnSide,
    refProfileInfo,
    refProfileLoading,
    isNotActiveUser,
  } = props;
  const location = useLocation();

  if (!refProfileLoading && refProfileInfo != null) return null;
  if (isNotActiveUser) return null;

  const renderItems = () => {
    const { closeMenu } = props;
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

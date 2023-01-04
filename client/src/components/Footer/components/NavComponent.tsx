import React from 'react';
import { Nav } from 'react-bootstrap';
import classnames from 'classnames';

import { NavLinks } from './NavLinks';

import { currentYear } from '../../../utils';

import classes from './NavComponent.module.scss';

type Props = {
  hideNavLinks?: boolean;
};

export const NavComponent: React.FC<Props> = props => {
  return (
    <Nav className="pr-0 align-items-center">
      <NavLinks {...props} />
      <Nav.Item className={classnames(classes.navItem, 'text-white', 'p-0')}>
        © {currentYear()} FIO
      </Nav.Item>
    </Nav>
  );
};

import React from 'react';

import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

import { ROUTES } from '../../../constants/routes';
import config from '../../../config';

import classes from './NavComponent.module.scss';

type Props = {
  hideNavLinks?: boolean;
};

export const NavLinks: React.FC<Props> = props => {
  const { hideNavLinks } = props;

  if (hideNavLinks) return null;

  return (
    <>
      <Nav.Link
        to={config.supportUrl}
        as={Link}
        target="_blank"
        className={classnames(classes.navItem, 'text-white', 'p-0')}
      >
        Support
      </Nav.Link>
      <Nav.Link
        to={ROUTES.PRIVACY_POLICY}
        as={Link}
        className={classnames(classes.navItem, 'text-white', 'p-0')}
      >
        Privacy Policy
      </Nav.Link>
      <Nav.Link
        to={ROUTES.TERMS_OF_SERVICE}
        as={Link}
        className={classnames(classes.navItem, 'text-white', 'p-0')}
      >
        Terms of Service
      </Nav.Link>
    </>
  );
};

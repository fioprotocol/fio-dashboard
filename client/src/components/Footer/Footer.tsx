import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import classnames from 'classnames';

import { currentYear } from '../../utils';
import classes from './Footer.module.scss';

const Footer = (props: { homePageLink: string }) => {
  const { homePageLink } = props;

  return (
    <section className={classes.footer}>
      <Link to={homePageLink}>
        <div className={classes.logo} />
      </Link>
      <hr className={classes.divider} />
      <Nav className="pr-0 align-items-center">
        <Nav.Link
          href="#"
          className={classnames(classes.navItem, 'text-white', 'p-0')}
        >
          Privacy Policy
        </Nav.Link>
        <Nav.Link
          href="#"
          className={classnames(classes.navItem, 'text-white', 'p-0')}
        >
          © {currentYear()} FIO
        </Nav.Link>
      </Nav>
    </section>
  );
};

export default Footer;

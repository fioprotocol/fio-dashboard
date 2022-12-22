import React from 'react';
import { Link } from 'react-router-dom';

import { NavComponent } from './components/NavComponent';

import { ROUTES } from '../../constants/routes';

import classes from './Footer.module.scss';

type Props = {
  hideNavLinks?: boolean;
};

const Footer: React.FC<Props> = props => {
  return (
    <section className={classes.footer}>
      <Link to={ROUTES.HOME} className={classes.logoLink}>
        <div className={classes.logo} />
      </Link>
      <hr className={classes.divider} />
      <NavComponent {...props} />
    </section>
  );
};

export default Footer;

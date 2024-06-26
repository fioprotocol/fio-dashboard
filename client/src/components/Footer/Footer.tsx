import React from 'react';
import { Link } from 'react-router-dom';

import { NavComponent } from './components/NavComponent';

import { ROUTES } from '../../constants/routes';

import { useContext } from './FooterContext';

import classes from './Footer.module.scss';

type Props = {
  hideNavLinks?: boolean;
  isMaintenance?: boolean;
};

const Footer: React.FC<Props> = props => {
  const { isBranded } = useContext();

  return (
    <section className={classes.footer}>
      <Link to={ROUTES.HOME} className={classes.logoLink}>
        {isBranded && <span>Powered by </span>}
        <div className={classes.logo} />
      </Link>
      <hr className={classes.divider} />
      <NavComponent {...props} />
    </section>
  );
};

export default Footer;

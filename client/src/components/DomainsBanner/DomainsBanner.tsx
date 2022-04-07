import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { ROUTES } from '../../constants/routes';
import classes from './DomainsBanner.module.scss';

const DomainsBanner: React.FC = () => {
  return (
    <div className={classes.domainContainer}>
      <h5 className={classes.header}>FIO DOMAINS</h5>
      <h3 className={classes.title}>Looking for Something More Custom?</h3>
      <p className={classes.subtitle}>
        Register a custom domain for your own unique FIO Crypto Handle creation
        opportunities.
      </p>
      <Button variant="primary" className={classes.button}>
        <Link to={ROUTES.FIO_DOMAINS_SELECTION}>Register a Domain</Link>
      </Button>
    </div>
  );
};

export default DomainsBanner;

import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ROUTES } from '../../../constants/routes';

import classes from '../styles/AffiliateModal.module.scss';

export const AffiliateNoFCHModal: React.FC = () => {
  return (
    <div className={classes.container}>
      <FontAwesomeIcon icon="info-circle" className={classes.icon} />
      <h4 className={classes.title}>Missing FIO Handle</h4>
      <p className={classes.subtitle}>
        To complete your activation, you will need a FIO Handle to receive all
        your rewards.
      </p>
      <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>
        <Button className={classes.button}>Get a FREE FIO Handle Now</Button>
      </Link>
    </div>
  );
};

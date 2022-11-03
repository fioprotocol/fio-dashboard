import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { ROUTES } from '../../constants/routes';

import classes from './GetFioTokens.module.scss';

export const GetFioTokens: React.FC = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <h5 className={classes.title}>Need to Get FIO Tokens?</h5>
        <p className={classes.text}>
          FIO tokens are used to pay fees for certain transaction types such as
          FIO Domain and Crypto Handle registrations or adding bundles.
        </p>
        <p className={classnames(classes.text, classes.textRegular)}>
          Get FIO Token from one of our partners today.
        </p>
        <Link to={ROUTES.FIO_TOKENS_GET} className={classes.link}>
          <Button className={classes.button}>Get Now</Button>
        </Link>
      </div>
    </div>
  );
};

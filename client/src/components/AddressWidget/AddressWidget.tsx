import React from 'react';
import classnames from 'classnames';
import AddressDomainForm from '../../components/AddressDomainForm';
import { FORM_NAMES } from '../../constants/form';

import classes from './AddressWidget.module.scss';

const AddressWidget = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        <span className="boldText">Hi!</span> Get Your{' '}
        <span className={classes.newLine}>
          <span className={classnames(classes.coloredText, 'boldText')}>
            FIO Address
          </span>{' '}
          Now
        </span>
      </h1>
      <p className={classes.subtitle}>
        Registering a FIO Address is fast and easy. Simply add a username and
        select a domain.
      </p>
      <div className={classes.form}>
        <AddressDomainForm isHomepage formName={FORM_NAMES.ADDRESS} />
      </div>
      <div className={classes.bottom} />
    </div>
  );
};

export default AddressWidget;

import React from 'react';
import classnames from 'classnames';
import AddressForm from '../../components/AddressForm';

import classes from './AddressWidget.module.scss';

const AddressWidget = props => {
  return (
    <div className={classes.container}>
      <h1 className={classnames(classes.title, 'mx-3')}>
        <span className='boldText'>Hi!</span> Get Your{' '}
        <span className={classnames(classes.coloredText, 'boldText')}>FIO Address</span> Now
      </h1>
      <p className={classes.subtitle}>
        Registering a FIO Address is fast and easy. Simply add a username and
        select a domain.
      </p>
      <div className={classes.form}>
        <AddressForm isHomepage/>
      </div>
      <div className={classes.bottom}/>
    </div>
  );
};

export default AddressWidget;

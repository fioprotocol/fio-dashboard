import React, { ReactNode } from 'react';
import classnames from 'classnames';

import AddressDomainForm from '../../components/AddressDomainForm';

import { ADDRESS } from '../../constants/common';

import classes from './AddressWidget.module.scss';

type Props = {
  links?: {
    getCryptoHandle: string | ReactNode;
  };
};

const AddressWidget: React.FC<Props> = props => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        <span className="boldText">Hi!</span> Get Your{' '}
        <span className={classes.newLine}>
          <span className={classnames(classes.coloredText, 'boldText')}>
            FIO Crypto Handle
          </span>{' '}
          Now
        </span>
      </h1>
      <p className={classes.subtitle}>
        Registering a FIO Crypto Handle is fast and easy. Simply add a username
        and select a domain.
      </p>
      <div className={classes.form}>
        <AddressDomainForm isHomepage={true} type={ADDRESS} {...props} />
      </div>
      <div className={classes.bottom} />
    </div>
  );
};

export default AddressWidget;

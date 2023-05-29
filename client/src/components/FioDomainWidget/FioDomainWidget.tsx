import React from 'react';
import classnames from 'classnames';

import { FioDomainForm } from './components/FioDomainForm';

import { FormValues } from './types';

import classes from './FioDomainWidget.module.scss';

type Props = {
  isReverseColors?: boolean;
  onSubmit: (values: FormValues) => void;
};

export const FioDomainWidget: React.FC<Props> = props => {
  const { isReverseColors, onSubmit } = props;

  return (
    <div
      className={classnames(
        classes.container,
        isReverseColors && classes.isReverseColors,
      )}
    >
      <h1 className={classes.title}>Catch the Next Big Thing</h1>
      <p className={classes.subtitle}>
        Secure a FIO Domain NFT to customize your web3 identity
      </p>
      <FioDomainForm onSubmit={onSubmit} />
    </div>
  );
};

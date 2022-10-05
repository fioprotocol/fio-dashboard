import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { FioDomainForm } from './components/FioDomainForm';

import { FormValues } from './types';

import classes from './FioDomainWidget.module.scss';

type Props = {
  withoutBackground?: boolean;
  withoutBottomMargin?: boolean;
  onSubmit: (values: FormValues) => void;
};

export const FioDomainWidget: React.FC<Props> = props => {
  const { withoutBackground, withoutBottomMargin, onSubmit } = props;

  return (
    <div
      className={classnames(
        classes.container,
        withoutBackground && classes.withoutBackground,
        withoutBottomMargin && classes.withoutBottomMargin,
      )}
    >
      <h1 className={classes.title}>
        <span className="boldText">
          Grab Your FIO <span className="doubleColor">Domain</span> Now
        </span>
      </h1>
      <p className={classes.subtitle}>
        Purchase your FIO Domain before it’s gone forever. 2 and 3 character
        domains still available.
      </p>
      <FioDomainForm onSubmit={onSubmit} />
      <div className={classes.actionTextContainer}>
        <div className={classes.iconContainer}>
          <FontAwesomeIcon icon="certificate" className={classes.icon} />
          <FontAwesomeIcon icon="exclamation" className={classes.insideIcon} />
        </div>
        <span className={classes.actionText}>
          Pssst .. You can buy your domain with a credit card!
        </span>
      </div>
    </div>
  );
};

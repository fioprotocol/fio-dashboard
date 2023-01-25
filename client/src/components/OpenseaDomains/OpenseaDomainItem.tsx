import React from 'react';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import { AnyObject } from '../../types';

import classes from './OpenseaDomains.module.scss';

type Props = {
  domain: AnyObject;
};

export const OpenseaDomainItem: React.FC<Props> = props => {
  const {
    domain: { domain, price, link },
  } = props;

  return (
    <div className={classes.domain}>
      <div className={classes.domainTitle}>@{domain}</div>
      <div className={classes.domainContainer}>
        <div className={classes.domainPrice}>
          <span className={classes.domainPriceLabel}>Current Price</span>
          <span className={classes.domainPriceValue}>{price}</span>
        </div>
        <div className={classes.domainAction}>
          <a href={link}>
            <SubmitButton
              text="BUY NOW"
              hasLowHeight
              hasSmallText
              withoutMargin
            />
          </a>
        </div>
      </div>
    </div>
  );
};

import React, { useCallback } from 'react';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import { CURRENCY_CODES } from '../../constants/common';

import classes from './AvailableDomains.module.scss';

type Props = {
  domain: string;
  price: string;
  onClick: (domain: string) => void;
};

export const AvailableDomainsItem: React.FC<Props> = props => {
  const { domain, price, onClick } = props;

  const handleClick = useCallback(() => {
    onClick(domain);
  }, [onClick, domain]);

  return (
    <div className={classes.domain}>
      <div className={classes.domainTitle}>@{domain}</div>
      <div className={classes.domainContainer}>
        <div className={classes.domainPrice}>
          <span className={classes.domainPriceLabel}>Price</span>
          <span className={classes.domainPriceValue}>
            {price} {CURRENCY_CODES.USDC}
          </span>
        </div>
        <div className={classes.domainAction}>
          <SubmitButton
            text="BUY NOW"
            onClick={handleClick}
            hasLowHeight
            hasSmallText
            withoutMargin
          />
        </div>
      </div>
    </div>
  );
};

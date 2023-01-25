import React from 'react';

import { FunFactLabel } from '../FunFactLabel';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import { OpenseaDomainItem } from './OpenseaDomainItem';

import { AnyObject } from '../../types';

import classes from './OpenseaDomains.module.scss';

import openseaLogo from '../../assets/images/opensea-logo-dark.svg';

type Props = {
  domains: AnyObject[];
};

export const OpenseaDomains: React.FC<Props> = props => {
  const { domains } = props;

  if (!domains.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <span>FOR SALE ON</span>
      </div>

      <div className={classes.logoContainer}>
        <img alt="OpenSea" src={openseaLogo} className={classes.logo} />
      </div>

      <div className={classes.grid}>
        {domains.map(item => (
          <OpenseaDomainItem key={item.id} domain={item} />
        ))}
      </div>

      <div className={classes.buttonWrapper}>
        <a href="https://opensea.io/collection/fio-domains">
          <SubmitButton
            text="SHOW MORE"
            hasLowHeight
            hasSmallText
            withoutMargin
          />
        </a>
      </div>

      <FunFactLabel>
        <span>
          The volume of <span className={classes.bold}>web3 domains sold</span>{' '}
          on secondary markets is{' '}
          <span className={classes.bold}>more than $270,000,000</span>
        </span>
      </FunFactLabel>
    </div>
  );
};

import React from 'react';

import { FunFactLabel } from '../FunFactLabel';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import { OpenseaDomainItem } from './OpenseaDomainItem';

import { OpenseaDomain } from './types';

import classes from './OpenseaDomains.module.scss';

import openseaLogo from '../../assets/images/opensea-logo-dark.svg';

// TODO: replace with API call for available domains
const OPENSEA_DOMAINS: OpenseaDomain[] = [
  {
    id: 17,
    domain: '2023',
    price: '0.25 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/17',
  },
  {
    id: 15,
    domain: 'telephone',
    price: '0.25 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/15',
  },
  {
    id: 46,
    domain: 'monnos',
    price: '0.25 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/46',
  },
  {
    id: 44,
    domain: 'keplerk',
    price: '0.5 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/44',
  },
  {
    id: 43,
    domain: 'xcard',
    price: '0.98 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/43',
  },
  {
    id: 45,
    domain: 'fluency',
    price: '1 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/45',
  },
  {
    id: 33,
    domain: 'bonk',
    price: '10 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/33',
  },
  {
    id: 22,
    domain: 'c4',
    price: '10 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/22',
  },
  {
    id: 41,
    domain: 'bookstore',
    price: '19.9 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/41',
  },
  {
    id: 37,
    domain: 'lotery',
    price: '111 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/37',
  },
  {
    id: 40,
    domain: 'sygnum',
    price: '150 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/40',
  },
  {
    id: 35,
    domain: 'lionelmessi',
    price: '1100 ETH',
    link:
      'https://opensea.io/assets/matic/0x3ab00687ae60eea770498b59685174e3fc81c424/35',
  },
];

export const OpenseaDomains: React.FC = () => {
  if (!OPENSEA_DOMAINS.length) {
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
        {OPENSEA_DOMAINS.map(item => (
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

import React, { useCallback } from 'react';

import { FunFactLabel } from '../FunFactLabel';

import { AvailableDomainsItem } from './AvailableDomainsItem';

import classes from './AvailableDomains.module.scss';

// TODO: replace with API call for available domains
const AVAILABLE_DOMAINS = [
  {
    id: 1,
    domain: 'domain',
  },
  {
    id: 2,
    domain: 'domain',
  },
  {
    id: 3,
    domain: 'domain',
  },
  {
    id: 4,
    domain: 'domain',
  },
  {
    id: 5,
    domain: 'domain',
  },
  {
    id: 6,
    domain: 'domain',
  },
  {
    id: 7,
    domain: 'domain',
  },
  {
    id: 8,
    domain: 'domain',
  },
  {
    id: 9,
    domain: 'domain',
  },
];

type Props = {
  onSubmit: (values: { domain: string }) => void;
  domainPrice: string;
};

export const AvailableDomains: React.FC<Props> = props => {
  const { onSubmit, domainPrice } = props;

  const onClick = useCallback(
    (domain: string) => {
      onSubmit({ domain });
    },
    [onSubmit],
  );

  if (!AVAILABLE_DOMAINS.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>Now Available!</div>
      <div className={classes.grid}>
        {AVAILABLE_DOMAINS.map(item => (
          <AvailableDomainsItem
            key={item.id}
            domain={item.domain}
            price={domainPrice}
            onClick={onClick}
          />
        ))}
      </div>

      <FunFactLabel>
        <span>The most expensive web3 domain sold for $2,000,000</span>
      </FunFactLabel>
    </div>
  );
};

import React, { useCallback } from 'react';
import Slider from 'react-slick';

import { FunFactLabel } from '../FunFactLabel';

import { AvailableDomainsItem } from './AvailableDomainsItem';

import { useCheckIfDesktop } from '../../screenType';

import { AdminDomain } from '../../api/responses';

import classes from './AvailableDomains.module.scss';

type Props = {
  domains: AdminDomain[];
  onSubmit: (values: { domain: string }) => void;
  domainPrice: string;
};

export const AvailableDomains: React.FC<Props> = props => {
  const { domains, onSubmit, domainPrice } = props;
  const isDesktop = useCheckIfDesktop();

  const onClick = useCallback(
    (domain: string) => {
      onSubmit({ domain });
    },
    [onSubmit],
  );

  if (!domains.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>Now Available!</div>
      <Slider
        className={classes.grid}
        dots
        infinite={false}
        arrows={false}
        rows={3}
        slidesToShow={isDesktop ? 3 : 1}
        slidesToScroll={isDesktop ? 3 : 1}
      >
        {domains.map(item => (
          <AvailableDomainsItem
            key={item.id}
            domain={item.name}
            price={domainPrice}
            onClick={onClick}
          />
        ))}
      </Slider>

      <FunFactLabel>
        <span>The most expensive web3 domain sold for $2,000,000</span>
      </FunFactLabel>
    </div>
  );
};

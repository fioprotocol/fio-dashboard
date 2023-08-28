import React from 'react';

import { SpecialsBannerBadge } from './SpecialsBannerBadge';

import classes from './SpecialsBanner.module.scss';

import controlIcon from '../../assets/images/landing-page/control.svg';
import controlMobileIcon from '../../assets/images/landing-page/control-mobile.svg';
import customizableIcon from '../../assets/images/landing-page/customizable.svg';
import customizableMobileIcon from '../../assets/images/landing-page/customizable-mobile.svg';
import domainsAreNftsIcon from '../../assets/images/landing-page/domains-are-nfts.svg';
import domainsAreNftsMobileIcon from '../../assets/images/landing-page/domains-are-nfts-mobile.svg';

export const DomainsSpecialsBanner: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.title}>What makes FIO domains special?</div>

      <SpecialsBannerBadge
        icon={domainsAreNftsIcon}
        mobileIcon={domainsAreNftsMobileIcon}
        title="DOMAINS ARE NFTS"
        subtitle="Transferrable & Tradeable on OpenSea"
        isFlipped
        isBigImage
      />
      <SpecialsBannerBadge
        icon={controlIcon}
        mobileIcon={controlMobileIcon}
        title="CONTROL"
        subtitle="Decide who can register FIO Handles on your domain"
        isBigImage
      />
      <SpecialsBannerBadge
        icon={customizableIcon}
        mobileIcon={customizableMobileIcon}
        title="CUSTOMIZABLE"
        subtitle="Use your FIO domain to create a unique web3 identity"
        isFlipped
        isBigImage
      />
    </div>
  );
};

import React from 'react';

import { SpecialsBannerBadge } from './SpecialsBannerBadge';

import classes from './SpecialsBanner.module.scss';

import neverExpiresIcon from '../../assets/images/landing-page/never-expires.svg';
import neverExpiresMobileIcon from '../../assets/images/landing-page/never-expires-mobile.svg';
import sendReceiveIcon from '../../assets/images/landing-page/send-receive.svg';

export const FCHSpecialsBanner: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.title}>What makes FIO Crypto Handle special?</div>

      <SpecialsBannerBadge
        icon={sendReceiveIcon}
        title="SEND & RECEIVE CRYPTO"
        subtitle="Use a single username across any token, chain or wallet"
        isFlipped
      />
      <SpecialsBannerBadge
        icon={neverExpiresIcon}
        mobileIcon={neverExpiresMobileIcon}
        title="NEVER EXPIRES"
        subtitle="FIO usernames are yours for life with no additional cost"
      />
    </div>
  );
};

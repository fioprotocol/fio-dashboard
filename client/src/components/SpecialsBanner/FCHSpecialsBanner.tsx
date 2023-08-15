import React from 'react';

import { SpecialsBannerBadge } from './SpecialsBannerBadge';

import classes from './SpecialsBanner.module.scss';

import neverExpiresIcon from '../../assets/images/landing-page/never-expires.svg';
import neverExpiresMobileIcon from '../../assets/images/landing-page/never-expires-mobile.svg';
import sendReceiveIcon from '../../assets/images/landing-page/send-receive.svg';

type Props = {
  customSendReceiveIcon?: string;
  customNeverExpiresIcon?: string;
  customNeverExpiresMobileIcon?: string;
};

export const FCHSpecialsBanner: React.FC<Props> = ({
  customSendReceiveIcon,
  customNeverExpiresIcon,
  customNeverExpiresMobileIcon,
}) => {
  return (
    <div className={classes.container}>
      <div className={classes.title}>What makes FIO Handle special?</div>

      <SpecialsBannerBadge
        icon={customSendReceiveIcon ? customSendReceiveIcon : sendReceiveIcon}
        title="SEND & RECEIVE CRYPTO"
        subtitle="Use a single username across any token, chain or wallet"
        isFlipped
      />
      <SpecialsBannerBadge
        icon={
          customNeverExpiresIcon ? customNeverExpiresIcon : neverExpiresIcon
        }
        mobileIcon={
          customNeverExpiresMobileIcon
            ? customNeverExpiresMobileIcon
            : neverExpiresMobileIcon
        }
        title="NEVER EXPIRES"
        subtitle="FIO usernames are yours for life with no additional cost"
      />
    </div>
  );
};

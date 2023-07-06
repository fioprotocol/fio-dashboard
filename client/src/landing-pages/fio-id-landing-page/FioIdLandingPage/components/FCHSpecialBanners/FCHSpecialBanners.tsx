import React from 'react';

import neverExpiresIcon from '../../../../../assets/images/landing-page/never-expires.svg';
import sendReceiveIcon from '../../../../../assets/images/landing-page/send-receive.svg';

import classes from './FCHSpecialBanners.module.scss';

const SpecialBannerItem = ({
  imageAlt,
  imageSrc,
  text,
}: {
  imageAlt: string;
  imageSrc: string;
  text: string;
}) => (
  <div className={classes.specialBannerItem}>
    <img src={imageSrc} alt={imageAlt} className={classes.image} />
    <p className={classes.text}>{text}</p>
  </div>
);

export const FCHSpecialBanners: React.FC = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>What makes FIO Handle so special?</h1>
      <div className={classes.specialBannersContainer}>
        <SpecialBannerItem
          imageAlt="Send Icon"
          imageSrc={sendReceiveIcon}
          text="Send & Receive crypto across any token, chain or wallet."
        />
        <SpecialBannerItem
          imageAlt="Expire Icon"
          imageSrc={neverExpiresIcon}
          text="FIO Handles are yours for life with no additional cost."
        />
      </div>
    </div>
  );
};

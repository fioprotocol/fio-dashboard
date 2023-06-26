import React from 'react';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { SOCIAL_MEDIA_LINKS } from '../../../../constants/socialMediaLinks';

import { PublicAddressDoublet } from '../../../../types';

import classes from './FioSocialMediaLinkItem.module.scss';

type Props = {
  actionButton?: React.ReactElement;
} & PublicAddressDoublet;

export const FioSocialMediaLinkItem: React.FC<Props> = props => {
  const { actionButton, publicAddress, tokenCode } = props;

  const socialMediaLinkItem = SOCIAL_MEDIA_LINKS.find(
    socialMediaLink =>
      socialMediaLink.name.toLowerCase() === tokenCode.toLowerCase(),
  );

  const link = socialMediaLinkItem.link + publicAddress;

  return (
    <Badge type={BADGE_TYPES.WHITE} show className={classes.container}>
      <img
        src={socialMediaLinkItem.iconSrc}
        alt={link}
        className={classes.icon}
      />
      <p className={classes.link}>{link}</p>
      {actionButton && <div>{actionButton}</div>}
    </Badge>
  );
};

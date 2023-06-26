import React from 'react';

import InfoBadge from '../../../../components/Badges/InfoBadge/InfoBadge';
import Loader from '../../../../components/Loader/Loader';

import { FioSocialMediaLinkItem } from '../FioSocialMediaLinkItem';

import { PublicAddressDoublet } from '../../../../types';

import classes from './FioSocialMediaLinksList.module.scss';

type Props = {
  loading: boolean;
  socialMediaLinks: PublicAddressDoublet[];
};

export const FioSocialMediaLinksList: React.FC<Props> = props => {
  const { socialMediaLinks, loading } = props;

  if (loading) return <Loader />;

  if (!socialMediaLinks || socialMediaLinks.length === 0)
    return (
      <div className={classes.container}>
        <InfoBadge
          title="No Social Media Links"
          message="You have no linked Social Media Links for this FIO Crypto Handle"
        />
      </div>
    );

  return (
    <div className={classes.container}>
      {socialMediaLinks.map(socialMediaLinkItem => (
        <FioSocialMediaLinkItem
          {...socialMediaLinkItem}
          key={socialMediaLinkItem.tokenCode}
        />
      ))}
    </div>
  );
};

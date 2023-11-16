import React from 'react';

import ApplicationImageSrc from '../../assets/images/detailed-ref-main-page/applications.svg';
import PaymentsImageSrc from '../../assets/images/detailed-ref-main-page/payments.svg';
import SocialMediaImageSrc from '../../assets/images/detailed-ref-main-page/social-media.svg';

import classes from './DetailedInfoMainPageComponent.module.scss';

type Props = {
  domain?: string;
};

const DEFAULT_DOMAIN_NAME = 'rulez';

const TILES_CONTENT = [
  {
    img: PaymentsImageSrc,
    title: 'Payments',
    subtitle: 'Payments can be made to any mapped cryptocurrencies.',
  },
  {
    img: ApplicationImageSrc,
    title: 'Applications',
    subtitle: `Use the @${DEFAULT_DOMAIN_NAME} handle in over 75 leading crypto applications.`,
  },
  {
    img: SocialMediaImageSrc,
    title: 'Social Media',
    subtitle: 'Get followed or contacted on any linked social media.',
  },
];

export const DetailedInfoMainPageComponent: React.FC<Props> = props => {
  const { domain } = props;

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>One Handle, Many Uses</h2>
      <p className={classes.subtitle}>
        Utilize the FIO App to map cryptocurrencies for payment receipt and link
        your social media, or use your handle with one the many apps which
        integrate FIO handles.
      </p>
      <div className={classes.tilesContainer}>
        {TILES_CONTENT.map(tileItem => (
          <div className={classes.tileItem} key={tileItem.title}>
            <img
              src={tileItem.img}
              alt={tileItem.title}
              className={classes.img}
            />
            <h5 className={classes.title}>{tileItem.title}</h5>
            <p className={classes.subtitle}>
              {domain
                ? tileItem.subtitle.replace(DEFAULT_DOMAIN_NAME, domain)
                : tileItem.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

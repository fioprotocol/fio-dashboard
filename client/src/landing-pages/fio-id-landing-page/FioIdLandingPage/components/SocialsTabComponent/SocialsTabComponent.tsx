import React from 'react';

import Loader from '../../../../../components/Loader/Loader';

import { TabUIContainer } from '../TabUIContainer';

import { useContext } from './SocialsTabComponentContext';

import classes from './SocialsTabComponent.module.scss';

type Props = {
  fch: string;
};

const content = {
  title: 'Social Links',
  subtitle:
    'You can follow or contact me on any of the following social links.',
  emptyState: {
    title: 'No Social Links',
    message: 'There are no social links for this FIO Handle.',
  },
};

export const SocialsTabComponent: React.FC<Props> = props => {
  const { fch } = props;
  const { loading, socialLinks } = useContext({ fch });
  return (
    <TabUIContainer {...content} showEmptyState={!socialLinks.length}>
      {loading ? (
        <Loader />
      ) : (
        <div className={classes.container}>
          {socialLinks.map(socialLink => {
            const { iconSrc, link, name } = socialLink;
            return (
              <div className={classes.socialItem} key={link}>
                <div className={classes.imageContainer}>
                  <img src={iconSrc} alt={link} className={classes.image} />
                  <p className={classes.name}>{name}</p>
                </div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  {link}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </TabUIContainer>
  );
};

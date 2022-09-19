import React from 'react';
import classnames from 'classnames';

import DomainPageImageSrc from '../../../assets/images/domain-landing-page/domain-page.png';

import classes from '../styles/HumanReadableMarketingSection.module.scss';

const contentList = [
  'Own your name and data - use it across services',
  'Use your FIO name to store all of your addresses',
  'Receive any crypto, tokens or NFTs',
  'Full security of being blockchain-native',
];

const HumanReadableMarketingSection: React.FC = () => {
  return (
    <section className={classes.container}>
      <div className={classes.imageContainer}>
        <img
          src={DomainPageImageSrc}
          alt="dashboard_view"
          className={classes.image}
        />
      </div>
      <div className={classes.contentContainer}>
        <h2 className={classnames(classes.title, 'boldText')}>
          Human Readable Names
        </h2>
        <p className={classes.subtitle}>
          Web3 decentalized naming for wallets, website and applications
        </p>
        <ul className={classes.contentList}>
          {contentList.map(contentListItem => (
            <li
              className={classnames(classes.contentListItem, 'boldText')}
              key={contentListItem}
            >
              {contentListItem}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HumanReadableMarketingSection;

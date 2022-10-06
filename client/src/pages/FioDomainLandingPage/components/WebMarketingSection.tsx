import React from 'react';
import classnames from 'classnames';

import webMarketingImageSrc from '../../../assets/images/domain-landing-page/web-marketing-image.png';

import classes from '../styles/WebMarketingSection.module.scss';

const WebMarketingSection: React.FC = () => {
  return (
    <section className={classnames(classes.container, classes.sectionLayout)}>
      <div className={classes.contentContainer}>
        <h1 className={classnames(classes.contentTitle, 'boldText')}>
          A Web3 Decentralized Digital Identity
        </h1>
        <p className={classes.contentSubtitle}>
          FIO domains are NFT domains that live on a public blockchain and give
          users complete ownership of their stored data.
        </p>
        <ul className={classes.contentList}>
          <li className={classnames(classes.contentListItem, 'boldText')}>
            Universal Username Across Apps & Websites
          </li>
          <li className={classnames(classes.contentListItem, 'boldText')}>
            Payment Address for wallets
          </li>
        </ul>
      </div>
      <div className={classes.imageContainer}>
        <img
          src={webMarketingImageSrc}
          alt="web_marketing_image"
          className={classes.image}
        />
      </div>
    </section>
  );
};

export default WebMarketingSection;

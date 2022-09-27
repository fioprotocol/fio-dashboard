import React from 'react';
import classnames from 'classnames';

import walletIconSrc from '../../../assets/images/domain-landing-page/wallet.png';
import transferIconSrc from '../../../assets/images/domain-landing-page/transfer.png';
import shoppingBasketIconSrc from '../../../assets/images/domain-landing-page/shopping-basket.png';

import classes from '../styles/YourDomainYourControlSection.module.scss';

const contentItems = [
  {
    iconSrc: walletIconSrc,
    title: 'Store',
    text: 'Store domains within your wallet, just like any other crypto asset.',
  },
  {
    iconSrc: transferIconSrc,
    title: 'Transfer',
    text: 'Freely transferred between accounts, users, and wallets.',
  },
  {
    iconSrc: shoppingBasketIconSrc,
    title: 'Sell',
    text: 'Easily sell your domains on secondary domain listing marketplaces.',
  },
];

const YourDomainYourControlSection: React.FC = () => {
  return (
    <section className={classes.sectionLayout}>
      <div className={classes.container}>
        <h1 className={classnames(classes.title, 'boldText')}>
          Your Domain, Your Control
        </h1>
        <p className={classes.subtitle}>
          All FIO Domains are non-fungible tokens, which means they can be
          freely transferred between accounts, users, and wallets as with any
          other crypto asset.
        </p>
        <div className={classes.contentContainer}>
          {contentItems.map(contentItem => {
            const { iconSrc, title, text } = contentItem;
            return (
              <div key={title} className={classes.contentItem}>
                <img
                  src={iconSrc}
                  className={classes.contentItemIcon}
                  alt={`${title} title`}
                />
                <h3
                  className={classnames(classes.contentItemTitle, 'boldText')}
                >
                  {title}
                </h3>
                <p className={classes.contentItemText}>{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default YourDomainYourControlSection;

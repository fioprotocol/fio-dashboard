import React from 'react';
import classnames from 'classnames';

import AAXIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/aax-logo.png';
import BitcoinIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/bitcoin-com-logo.png';
import ChangellyIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/changelly-logo.png';
import EdgeIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/edge-logo.png';
import GuardaIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/guarda-logo.png';
import LiquidIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/liquid-logo.png';
import OperaIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/opera-logo.png';
import TrustWalletIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/trust-wallet-logo.png';
import WhiteBitIconSrc from '../../../assets/images/domain-landing-page/applications-and-wallets/white-bit-logo.png';

import classes from '../styles/IntegrationSupportSection.module.scss';

const LINK = 'https://fioprotocol.io/ecosystem/';

const contentItems = [
  {
    iconSrc: AAXIconSrc,
    title: 'AAX',
    list: ['FIO Send'],
  },
  {
    iconSrc: BitcoinIconSrc,
    title: 'Bitcoin.com',
    list: ['FIO Send'],
  },
  {
    iconSrc: ChangellyIconSrc,
    title: 'Changelly',
    list: ['FIO Receive, Request & Send', 'FIO Token', 'FIO Trading'],
  },
  {
    iconSrc: EdgeIconSrc,
    title: 'Edge Wallet',
    list: [
      'FIO Crypto Handles & Domains',
      'FIO Receive, Request & Send',
      'FIO Token',
      'FIO Data',
    ],
  },
  {
    iconSrc: GuardaIconSrc,
    title: 'Guarda Wallet',
    list: ['FIO Crypto Handles', 'FIO Receive, Request & Send', 'FIO Token'],
  },
  {
    iconSrc: LiquidIconSrc,
    title: 'Liquid',
    list: [
      'FIO Receive, Request & Send',
      'FIO Token',
      'FIO Trading',
      'FIO Data',
    ],
  },
  {
    iconSrc: OperaIconSrc,
    title: 'Opera',
    list: ['FIO Crypto Handles & Domains', 'FIO Receive & Send'],
  },
  {
    iconSrc: TrustWalletIconSrc,
    title: 'Trust Wallet',
    list: ['FIO Domains', 'FIO Send', 'FIO Token'],
  },
  {
    iconSrc: WhiteBitIconSrc,
    title: 'WhiteBit',
    list: ['FIO Receive & Request', 'FIO Token', 'FIO Trading'],
  },
];

const IntegrationSupportSection: React.FC = () => {
  return (
    <section className={classes.sectionLayout}>
      <div className={classes.container}>
        <h2 className={classnames(classes.title, 'boldText')}>
          Applications & Wallets
        </h2>
        <p className={classes.subtitle}>
          Applications that support FIO protocol.
        </p>
        <div className={classes.contentContainer}>
          {contentItems.map(contentItem => {
            const { iconSrc, title, list } = contentItem;
            return (
              <div className={classes.contentItem} key={title}>
                <img
                  src={iconSrc}
                  alt={title}
                  className={classes.contentIcon}
                />
                <div className={classes.contentTextContainer}>
                  <h5 className={classes.contentItemTitle}>{title}</h5>
                  <ul className={classes.contetnItemList}>
                    {list.map(listItem => (
                      <li
                        className={classes.contentItemListItem}
                        key={listItem}
                      >
                        {listItem}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <a
          href={LINK}
          target="_blank"
          rel="noreferrer"
          className={classes.actionButton}
        >
          View All Applications
        </a>
      </div>
    </section>
  );
};

export default IntegrationSupportSection;

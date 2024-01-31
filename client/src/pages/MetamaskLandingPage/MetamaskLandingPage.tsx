import React from 'react';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';

import metamaskIcon from '../../assets/images/metamask.svg';
import fioMetamask from '../../assets/images/metamask-landing/fio-metamask.svg';
import atSign from '../../assets/images/metamask-landing/at-sign.svg';
import paperAirplaneIcon from '../../assets/images/metamask-landing/paper-airplane.svg';
import signatureIcon from '../../assets/images/metamask-landing/signature.svg';
import laptopMetamaskIcon from '../../assets/images/metamask-landing/laptop-metamask.svg';
import metamaskAtIcon from '../../assets/images/metamask-landing/metamask-at.svg';
import sayferLogo from '../../assets/images/metamask-landing/sayfer-logo.svg';

import classes from './MetamaskLangingPage.module.scss';

const featureItems = [
  {
    title: 'FIO Handles',
    text:
      'Replace your complex public MetaMask (or any other) wallet addresses for all tokens on all blockchains with a custom and censorship-resistant human readable handle.',
    iconSrc: atSign,
  },
  {
    title: 'FIO Requests',
    text:
      'Send privacy-preserving Venmo-style crypto payment requests from the FIO app to any other user with a FIO Handle for payments to MetaMask wallet.',
    iconSrc: paperAirplaneIcon,
  },
  {
    title: 'Map Addresses',
    text:
      'Map your complex MetaMask public addresses to your single FIO Handle to send, receive or request any crypto in your MetaMask wallet.',
    iconSrc: paperAirplaneIcon,
  },
  {
    title: 'NFT Signatures',
    text:
      'Prevent forgery of any NFT within your MetaMask wallet with on-chain attestation on any blockchain.',
    iconSrc: signatureIcon,
  },
];

const SeeMoreLink = 'https://fio.net/discover/features-benefits';
const ActionButtonText = 'COMING SOON!';

const MetamaskLandingPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <section className={classes.header}>
        <div className={classes.content}>
          <div className={classes.badge}>NEWLY LAUNCHED</div>
          <h1 className={classes.title}>
            MetaMask now
            <br />
            supports FIO
          </h1>
          <p className={classes.subtitle}>
            MetaMask users can now self-custody their FIO identity and gain
            access to the FIO App without setting up new accounts or passwords.
          </p>
          <SubmitButton
            text={
              <>
                <img
                  src={metamaskIcon}
                  className={classes.metamaskIcon}
                  alt="metamask"
                />
                <p className={classes.buttonText}>{ActionButtonText}</p>
              </>
            }
            hasAutoHeight
            hasAutoWidth
            className={classes.button}
            onClick={() => {}}
          />
        </div>
        <div className={classes.images}>
          <img src={fioMetamask} alt="FIO - Metamask icons" />
        </div>
      </section>
      <section className={classes.featuresContainer}>
        <h2 className={classes.title}>
          The FIO App & MetaMask - <span>Together at Last</span>
        </h2>
        <p className={classes.subtitle}>
          In addition to utilizing MetaMask to connect to the FIO App, you can
          now seamlessly and easily use the FIO app and MetaMask together.
        </p>
        <div className={classes.featureItemsContainer}>
          {featureItems.map(featureItem => (
            <div className={classes.featureItemContainer}>
              <div className={classes.featureItem} key={featureItem.title}>
                <img
                  alt="Feature Icon"
                  src={featureItem.iconSrc}
                  className={classes.img}
                />
                <h5 className={classes.title}>{featureItem.title}</h5>
                <p className={classes.text}>{featureItem.text}</p>
              </div>
            </div>
          ))}
        </div>
        <a
          href={SeeMoreLink}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          <SubmitButton
            text={<span className={classes.buttonText}>See More</span>}
          />
        </a>
      </section>
      <section className={classes.infoContainer}>
        <img
          src={laptopMetamaskIcon}
          alt="Metamask Laptop"
          className={classes.img}
        />
        <h1 className={classes.title}>FIO + MetaMask = Easier Crypto</h1>
        <div className={classes.infoItemsContainer}>
          <div className={classes.infoItem}>
            <h5 className={classes.infoTitle}>FIO Protocol</h5>
            <p className={classes.text}>
              FIO Protocol is powered by Layer 1 FIO Chain purpose-built to help
              wallets hide the complexity of blockchain transactions across all
              blockchains.
            </p>
          </div>
          <div className={classes.infoItem}>
            <h5 className={classes.infoTitle}>MetaMask</h5>
            <p className={classes.text}>
              The leading web3 wallet with over 30M monthly active users and de
              facto standard for accessing web-based dapps with almost every
              EVM-based dapp supporting it.
            </p>
          </div>
        </div>
      </section>
      <section className={classes.fioHandleSection}>
        <div className={classes.contentContainer}>
          <div className={classes.contentItems}>
            <div className={classes.content}>
              <h5 className={classes.preTitle}>For A Limited Time</h5>
              <h3 className={classes.title}>
                Get Your Free
                <br />
                @metamask Handle
              </h3>
              <p className={classes.subtitle}>
                Register a FIO handle on the public domain @metamask for free
                and share feedback on social media to be randomly selected from
                the FIO Prize Pool.
              </p>
              <SubmitButton
                text={ActionButtonText}
                hasAutoHeight
                hasAutoWidth
                className={classes.button}
              />
            </div>
            <div className={classes.imageContainer}>
              <img alt="Metamask icon" src={metamaskAtIcon} />
            </div>
          </div>
        </div>
      </section>
      <section className={classes.securityAudit}>
        <h3 className={classes.title}>Security Audit</h3>
        <p className={classes.subtitle}>
          The FIO MetaMask Snap has been audited by:
        </p>
        <img src={sayferLogo} alt="Sayfer icon" className={classes.img} />
      </section>
    </div>
  );
};

export default MetamaskLandingPage;

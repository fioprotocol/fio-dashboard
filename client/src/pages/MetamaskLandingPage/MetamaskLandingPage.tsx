import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Accordion,
  AccordionContext,
  AccordionToggleProps,
  useAccordionToggle,
} from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import { MetamaskConnectionModal } from '../../components/Modal/MetamaskConnectionModal';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import NotificationBadge from '../../components/NotificationBadge';

import { APP_TITLE } from '../../constants/labels';
import { ROUTES } from '../../constants/routes';
import { METAMASK_UNSUPPORTED_MOBILE_MESSAGE } from '../../constants/errors';

import { useContext as useContextMetamaskLandgingPage } from './MetamaskLandingPageContext';

import metamaskIcon from '../../assets/images/metamask.svg';
import fioMetamask from '../../assets/images/metamask-landing/fio-metamask.svg';
import atSign from '../../assets/images/metamask-landing/at-sign.svg';
import paperAirplaneIcon from '../../assets/images/metamask-landing/paper-airplane.svg';
import signatureIcon from '../../assets/images/metamask-landing/signature.svg';
import laptopMetamaskIcon from '../../assets/images/metamask-landing/laptop-metamask.svg';
import metamaskAtIcon from '../../assets/images/metamask-landing/metamask-at.svg';
import sayferLogo from '../../assets/images/metamask-landing/sayfer-logo.svg';

import classes from './MetamaskLangingPage.module.scss';

const accordionContent = [
  {
    title: 'Why should I use the FIO Snap with MetaMask Wallet?',
    text:
      'The FIO MetaMask Snap allows for self-custody of their FIO identity, allowing users to safely and seamlessly interact with the FIO App without setting up new accounts or passwords.',
  },
  {
    title: 'How does the FIO MetaMask Snap Work?',
    text:
      'Snaps are open-source extensions designed to securely extend the functionality of MetaMask, allowing for the creation of new web3 end-user experiences. Specifically, a snap is a JavaScript program that runs in an isolated environment, customizing the wallet experience.',
  },
  {
    title: 'How do I enable the FIO MetaMask Snap?',
    text: `To enable the FIO MetaMask Snap, visit the FIO App and connect to MetaMask. By doing so, you'll be prompted to install the Snap as a plugin to your existing MetaMask wallet. Once activated, your MetaMask will be equipped to interact with the FIO App allowing you to explore and use everything FIO has to offer.`,
  },
  {
    title:
      'Is my private key or recovery phrase exposed when using the FIO MetaMask Snap?',
    text: `No, your private key and recovery phrase are safeguarded within your MetaMask wallet. The FIO MetaMask Snap doesn't have access to them. It operates like a dapp, merely requesting signatures from MetaMask. This means it extends your wallet's capabilities without compromising the security of your private details.`,
  },
  {
    title: 'Is the FIO MetaMask Snap free to use?',
    text:
      'Yes, the FIO MetaMask Snap is free to use. Users do need a FIO Handle which utilizes FIO Bundles to cover FIO network fees for transactions on the blockchain.',
  },
  {
    title: 'Did the FIO MetaMask Snap pass any security audits?',
    text: 'Yes, it has been audited by Sayfer, an external audit team.',
  },
  {
    title: 'Can I use Snaps on both MetaMask Extension and Mobile App?',
    text:
      'Currently, Snaps are only available in the MetaMask browser extension v11.0 and up.',
  },
];

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
const SayferLogo =
  'https://sayfer.io/audits/metamask-snap-audit-report-for-fio/';
const videoId = 'uVoBj2nf9cQ';

const CustomToggle = ({
  eventKey,
  title,
  onClick,
}: AccordionToggleProps & { title: string }) => {
  const activeEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(eventKey, onClick);

  const isActive = activeEventKey === eventKey;

  return (
    <div className={classes.accordionItemContainer}>
      <div className={classes.iconContainer}>
        <AddIcon
          onClick={decoratedOnClick}
          className={classnames(
            classes.titleIcon,
            isActive && classes.isActiveIcon,
          )}
        />
      </div>
      <div className={classes.contentContainer}>
        <h5
          className={classnames(
            classes.accordionItemTitle,
            isActive && classes.isActive,
          )}
          onClick={decoratedOnClick}
        >
          {title}
        </h5>
      </div>
    </div>
  );
};

const MetamaskLandingPage: React.FC = () => {
  const {
    alternativeLoginError,
    isLoginModalOpen,
    isMobileDeviceWithMetamask,
    noMetamaskExtension,
    handleConnectClick,
    onLoginModalClose,
  } = useContextMetamaskLandgingPage();
  return (
    <>
      <Helmet>
        <title>{APP_TITLE} - MetaMask</title>
      </Helmet>
      <div className={classes.container}>
        <section className={classes.header}>
          <div className={classes.maxContentContainer}>
            <div className={classes.content}>
              <h1 className={classes.title}>
                MetaMask now
                <br />
                supports FIO
              </h1>
              <p className={classes.subtitle}>
                MetaMask users can now self-custody their FIO identity and gain
                access to the FIO App without setting up new accounts or
                passwords.
              </p>
              {!!alternativeLoginError && (
                <NotificationBadge
                  type={BADGE_TYPES.RED}
                  show={!!alternativeLoginError}
                  hasNewDesign
                  message="Sign in with MetaMask has failed. Please try again."
                  className={classes.errorBadge}
                  messageClassnames={classes.errorMessage}
                />
              )}
              {noMetamaskExtension && (
                <NotificationBadge
                  type={BADGE_TYPES.WARNING}
                  show={noMetamaskExtension}
                  hasNewDesign
                  title="MetaMask not detected."
                  message="Please ensure that the MetaMask browser extension is installed and active. Or refresh the page if it has just been installed."
                  className={classes.errorBadge}
                  messageClassnames={classes.errorMessage}
                />
              )}
              {isMobileDeviceWithMetamask && (
                <NotificationBadge
                  type={BADGE_TYPES.WARNING}
                  show={isMobileDeviceWithMetamask}
                  hasNewDesign
                  message={METAMASK_UNSUPPORTED_MOBILE_MESSAGE}
                  className={classes.errorBadge}
                  messageClassnames={classes.errorMessage}
                />
              )}
              <SubmitButton
                text={
                  <>
                    <img
                      src={metamaskIcon}
                      className={classes.metamaskIcon}
                      alt="metamask"
                    />
                    <p className={classes.buttonText}>Sign in with MetaMask</p>
                  </>
                }
                hasAutoHeight
                hasAutoWidth
                disabled={isMobileDeviceWithMetamask}
                className={classes.button}
                onClick={handleConnectClick}
              />
            </div>
            <div className={classes.images}>
              <img src={fioMetamask} alt="FIO - Metamask icons" />
            </div>
          </div>
        </section>
        <section className={classes.featuresContainer}>
          <div className={classes.maxContentContainer}>
            <h2 className={classes.title}>
              The FIO App & MetaMask - <span>Together at Last</span>
            </h2>
            <p className={classes.subtitle}>
              In addition to utilizing MetaMask to connect to the FIO App, you
              can now seamlessly and easily use the FIO app and MetaMask
              together.
            </p>
            <div className={classes.featureItemsContainer}>
              {featureItems.map(featureItem => (
                <div
                  className={classes.featureItemContainer}
                  key={featureItem.title}
                >
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
          </div>
        </section>
        <section className={classes.videoSectionContainer}>
          <div className={classes.videoContainer}>
            <iframe
              className={classes.videoFrame}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        </section>
        <section className={classes.infoContainer}>
          <div className={classes.maxContentContainer}>
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
                  FIO Protocol is powered by Layer 1 FIO Chain purpose-built to
                  help wallets hide the complexity of blockchain transactions
                  across all blockchains.
                </p>
              </div>
              <div className={classes.infoItem}>
                <h5 className={classes.infoTitle}>MetaMask</h5>
                <p className={classes.text}>
                  The leading web3 wallet with over 30M monthly active users and
                  de facto standard for accessing web-based dapps with almost
                  every EVM-based dapp supporting it.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={classes.fioHandleSection}>
          <div className={classes.maxContentContainer}>
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
                    Register a FIO handle on the public domain @metamask for
                    free and share feedback on social media to be randomly
                    selected from the FIO Prize Pool.
                  </p>
                  <Link
                    to={ROUTES.METAMASK_GATED_REGISTRATION}
                    className={classes.link}
                  >
                    <SubmitButton
                      text="Register Now"
                      hasAutoHeight
                      hasAutoWidth
                      className={classes.button}
                    />
                  </Link>
                </div>
                <div className={classes.imageContainer}>
                  <img alt="Metamask icon" src={metamaskAtIcon} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={classes.faqSection}>
          <div className={classes.maxContentContainer}>
            <h2 className={classes.title}>Frequently Asked Questions</h2>
            <p className={classes.subtitle}>
              Here you’ll find some frequently asked questions. If you still
              need help, feel free to reach us.
            </p>
            <Accordion defaultActiveKey="0" className={classes.accordion}>
              {accordionContent.map((accordionItem, i) => (
                <div
                  key={accordionItem.title}
                  className={classes.accordionItem}
                >
                  <CustomToggle
                    eventKey={i.toString()}
                    title={accordionItem.title}
                  ></CustomToggle>
                  <Accordion.Collapse eventKey={i.toString()}>
                    <div
                      className={classes.accordionItemText}
                      dangerouslySetInnerHTML={{
                        __html: accordionItem.text,
                      }}
                    />
                  </Accordion.Collapse>
                </div>
              ))}
            </Accordion>
          </div>
        </section>
        <section className={classes.securityAudit}>
          <div className={classes.maxContentContainer}>
            <h3 className={classes.title}>Security Audit</h3>
            <p className={classes.subtitle}>
              The FIO MetaMask Snap has been audited by:
            </p>
            <a href={SayferLogo} target="_blank" rel="noopener noreferrer">
              <img src={sayferLogo} alt="Sayfer icon" className={classes.img} />
            </a>
          </div>
        </section>
      </div>
      <MetamaskConnectionModal
        hasCloseButton
        show={isLoginModalOpen}
        title="Sign in to your account"
        text="For the most seamless Web3 experience please complete the actions in the MetaMask window."
        onClose={onLoginModalClose}
      />
    </>
  );
};

export default MetamaskLandingPage;

import React from 'react';
import { Helmet } from 'react-helmet-async';

import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';
import AddressWidget from '../../components/AddressWidget';
import { MetamaskConnectionModal } from '../../components/Modal/MetamaskConnectionModal';

import { APP_TITLE } from '../../constants/labels';

import { useContext } from './MetamaskGatedRegistrationContext';

import neverExpiresIcon from '../../assets/images/metamask-gated-registration-page/never-expires.svg';
import sendReceiveIcon from '../../assets/images/metamask-gated-registration-page/send-receive.svg';

import classes from './MetamaskgatedRegistration.module.scss';

const MetamaskGatedRegistration: React.FC = () => {
  const {
    addressWidgetContent,
    isLoginModalOpen,
    onLoginModalClose,
  } = useContext();

  return (
    <>
      <Helmet>
        <title>{APP_TITLE} - Get Your Free @metamask Handle</title>
      </Helmet>
      <div className={classes.container}>
        <AddressWidget isDarkWhite {...addressWidgetContent} />
        <FCHBanner fch="bob@metamask" />
        <FCHSpecialsBanner
          customNeverExpiresIcon={neverExpiresIcon}
          customNeverExpiresMobileIcon={neverExpiresIcon}
          customSendReceiveIcon={sendReceiveIcon}
        />
        <WidelyAdoptedSection />
        <AddressWidget
          isDarkWhite
          {...{ ...addressWidgetContent, logoSrc: '' }}
          isReverseColors
          isTransparent
        />
        <MetamaskConnectionModal
          hasCloseButton
          show={isLoginModalOpen}
          title="Sign in to your account"
          text="For the most seamless Web3 experience please complete the actions in the MetaMask window."
          onClose={onLoginModalClose}
        />
      </div>
    </>
  );
};

export default MetamaskGatedRegistration;

import React from 'react';

import NewReleasesIcon from '@mui/icons-material/NewReleases';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import SubmitButton from '../common/SubmitButton/SubmitButton';
import { LoadingIcon } from '../Input/StaticInputParts';
import ModalComponent from '../Modal/Modal';
import DangerModal from '../Modal/DangerModal';
import {
  VerificationLoader,
  VerificationLoaderProps,
} from '../VerificationLoader';

import MetamaskImgSrc from '../../assets/images/metamask.svg';

import classes from './GateVerificationComponent.module.scss';

type Props = {
  partnerName: string;
  refDomain: string;
  gatedChainName: string;
  connectButtonDisabled: boolean;
  showProviderWindowError: boolean;
  showBrowserExtensionErrorModal: boolean;
  showProviderLoadingIcon: boolean;
  showSelectProviderModalVisible: boolean;
  connectWallet: () => void;
  closeSelectProviderModal: () => void;
  onClick: () => void;
  setConnectionError: (data: null) => void;
  setShowBrowserExtensionErrorModal: (show: boolean) => void;
} & VerificationLoaderProps;

export const GateVerificationComponent: React.FC<Props> = props => {
  const {
    connectButtonDisabled,
    gatedChainName,
    hasFioVerificationError,
    hasVerifiedError,
    isVerified,
    infoMessage,
    loaderText,
    partnerName,
    refDomain,
    showProviderWindowError,
    showBrowserExtensionErrorModal,
    showProviderLoadingIcon,
    showSelectProviderModalVisible,
    verifyLoading,
    closeSelectProviderModal,
    connectWallet,
    onClick,
    setConnectionError,
    setShowBrowserExtensionErrorModal,
  } = props;

  const verificationLoaderProps = {
    isVerified,
    hasFioVerificationError,
    hasVerifiedError,
    infoMessage,
    loaderText,
    verifyLoading,
  };

  return (
    <div className={classes.container}>
      <VerificationLoader {...verificationLoaderProps} />

      {isVerified ? null : (
        <>
          <NewReleasesIcon />
          <p className={classes.text}>
            Registration of FIO Handles on the{' '}
            <span className={classes.boldText}>@{refDomain}</span> domain is
            reserved only for holders of {partnerName} NFTs on{' '}
            <span className={classes.boldText}>
              {gatedChainName?.toUpperCase()}
            </span>
            . <br />
            <span className={classes.boldText}>
              Connect your Metamask wallet to complete validation and register
              your FIO handle.
            </span>
          </p>

          <SubmitButton
            onClick={onClick}
            text={
              <div className={classes.metamask}>
                <img
                  src={MetamaskImgSrc}
                  alt="metamask-logo"
                  className={classes.logo}
                />{' '}
                Connect Metamask
              </div>
            }
            withBottomMargin
            hasLowHeight
            hasAutoWidth
            disabled={connectButtonDisabled}
          />
          <div className={classes.securityNote}>
            <VerifiedUserOutlinedIcon />
            <p className={classes.securityNoteText}>
              Security Note: Connection of your Metamask wallet is used for
              validation purposes only.
            </p>
          </div>
          <DangerModal
            show={showBrowserExtensionErrorModal}
            title="Please add MetaMask extension in your browser first. Or refresh the page if it has just been installed."
            onClose={() => setShowBrowserExtensionErrorModal(false)}
            buttonText="Close"
            onActionButtonClick={() => setShowBrowserExtensionErrorModal(false)}
          />
          <DangerModal
            show={showProviderWindowError}
            title="MetaMask window is already opened for this site. Please check your browser windows first."
            onClose={() => setConnectionError(null)}
            buttonText="Close"
            onActionButtonClick={() => setConnectionError(null)}
          />
          <ModalComponent
            show={showSelectProviderModalVisible}
            onClose={closeSelectProviderModal}
            closeButton={true}
            isSimple={true}
            isWide={true}
          >
            <div className={classes.connectWalletModal}>
              <h2>Please Connect Your Wallet</h2>
              <p className="pt-2">Please, connect your wallet to verify.</p>
              <button
                onClick={connectWallet}
                className={classes.connectWalletProviderTypeButton}
              >
                <div>MetaMask</div>
                <div className="d-flex justify-content-center align-items-center">
                  <LoadingIcon isVisible={showProviderLoadingIcon} />
                  <img
                    src={MetamaskImgSrc}
                    className={classes.providerIcon}
                    alt="metamask"
                  />
                </div>
              </button>
            </div>
          </ModalComponent>
        </>
      )}
    </div>
  );
};

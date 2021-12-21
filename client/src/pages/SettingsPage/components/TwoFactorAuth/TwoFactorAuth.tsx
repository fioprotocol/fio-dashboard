import React, { useState } from 'react';

import TwoFactorEnable from './components/TwoFactorEnable';
import TwoFactorDisable from './components/TwoFactorDisable';

import { ITEM_PROPS } from './constants';

type Props = {
  isTwoFAEnabled?: boolean;
  genericErrorIsShowing: boolean;
  hasTwoFactorAuth: boolean;
  toggleTwoFactorAuth: (enabled: boolean) => void;
  showGenericErrorModal: () => void;
};

const TwoFactorAuth: React.FC<Props> = props => {
  const {
    genericErrorIsShowing,
    hasTwoFactorAuth,
    toggleTwoFactorAuth,
    showGenericErrorModal,
  } = props;

  const [loading, toggleLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const onSuccessClose = () => {
    toggleSuccessModal(false);
  };

  const securityItemProps = {
    title: ITEM_PROPS.title,
    subtitle: ITEM_PROPS.subtitle,
    isGreen: hasTwoFactorAuth,
  };

  const successModalProps = {
    onClose: onSuccessClose,
    showModal: showSuccessModal,
  };

  const edgeConfirmActionProps = {
    setProcessing,
    processing,
    hideProcessing: true,
  };

  const componentsProps = {
    securityItemProps,
    successModalProps,
    edgeConfirmActionProps,
    genericErrorIsShowing,
    loading,
    processing,

    toggleTwoFactorAuth,
    showGenericErrorModal,
    toggleLoading,
    setProcessing,
    toggleSuccessModal,
  };

  const renderSecurityItem = () =>
    hasTwoFactorAuth ? (
      <TwoFactorDisable {...componentsProps} />
    ) : (
      <TwoFactorEnable {...componentsProps} />
    );

  return renderSecurityItem();
};

export default TwoFactorAuth;

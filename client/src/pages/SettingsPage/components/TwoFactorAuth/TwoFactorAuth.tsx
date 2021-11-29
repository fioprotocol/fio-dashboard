import React, { useState } from 'react';

import SecurityItem from '../SecurityItem';
import SuccessModal from '../../../../components/Modal/SuccessModal';
import DangerModal from '../../../../components/Modal/DangerModal';
import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';

const ITEM_PROPS = {
  title: '2 Factor Authentication',
  subtitle:
    'Two Factor Authentication (2FA) prevents unauthorized access from other devices, even if your username and password are compromised.',
  attentionText:
    'If you lose your access to you authenticator, it will take 7 days to access your account without the backup code.',
  modalTitle: 'Confirm Recovery Questions',
  dangerTitle: 'Are You Sure?',
  dangerSubtitle:
    '2FA is recommended to keep your device secure from unauthorized access from other devices.',
  dangerButtonText: 'Disable 2FA',
  successDisableModalTitle: '2FA DISABLED',
  successDisableModalSubtitle: 'Your 2FA has been successfully disabled.',
  successEnableModalTitle: '2FA ENABLED',
  successEnableModalSubtitle: 'Your 2FA has been successfully enabled.',
};

type Props = {
  isTwoFAEnabled?: boolean;
  loading: boolean;
  genericErrorIsShowing: boolean;
};

const TwoFactorAuth: React.FC<Props> = props => {
  const { loading, genericErrorIsShowing } = props;

  const [submitData, setSubmitData] = useState<boolean | null>(null);
  const [showDisableModal, toggleDisableModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  // todo: change to real data
  const [hasTwoFactor, toggleTwoFactor] = useState(false);

  const submitDisable = () => {
    toggleDisableModal(true);
    return true;
  };

  const onSuccessDisable = () => {
    setProcessing(false);
    toggleDisableModal(false);
    toggleSuccessModal(true);
  };

  const onCancelDisable = () => {
    setSubmitData(null);
    setProcessing(false);
    toggleDisableModal(true);
  };

  const submitEnable = () => {
    return true;
  };

  const onSuccessEnable = () => {
    setProcessing(false);
    toggleSuccessModal(true);
  };

  const onCancelEnable = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onDisableClose = () => toggleDisableModal(false);
  const onDisableClick = () => {
    toggleDisableModal(false);
    setSubmitData(true);
  };

  const onSuccessClose = () => {
    // remove on real usage data
    hasTwoFactor ? toggleTwoFactor(false) : toggleTwoFactor(true);
    toggleSuccessModal(false);
  };

  const securityItemProps = {
    onClick: () => setSubmitData(true),
    title: ITEM_PROPS.title,
    subtitle: ITEM_PROPS.subtitle,
    loading: loading || processing,
    isGreen: hasTwoFactor,

    // set changeable props
    buttonText: 'Enable',
    attentionText: '',
  };

  const successModalProps = {
    onClose: onSuccessClose,
    showModal: showSuccessModal,

    // set changeable props
    title: ITEM_PROPS.successEnableModalTitle,
    subtitle: ITEM_PROPS.successEnableModalSubtitle,
  };

  const edgeConfirmActionProps = {
    setProcessing,
    processing,
    hideProcessing: true,
    data: submitData,

    // set changeable props
    action: CONFIRM_PIN_ACTIONS.ENABLE_TWO_FACTOR,
    onSuccess: onSuccessEnable,
    onCancel: onCancelEnable,
    submitAction: submitEnable,
  };

  const dangerModalProps = {
    show: showDisableModal && !genericErrorIsShowing,
    onClose: onDisableClose,
    onActionButtonClick: onDisableClick,
    buttonText: ITEM_PROPS.dangerButtonText,
    showCancel: true,
    title: ITEM_PROPS.dangerTitle,
    subtitle: ITEM_PROPS.dangerSubtitle,
    loading: loading || processing,
  };

  if (hasTwoFactor) {
    // security props
    securityItemProps.buttonText = 'Disable';
    securityItemProps.attentionText = ITEM_PROPS.attentionText;

    // success modal props
    successModalProps.title = ITEM_PROPS.successDisableModalTitle;
    successModalProps.subtitle = ITEM_PROPS.successDisableModalSubtitle;

    // edge confirm action
    edgeConfirmActionProps.action = CONFIRM_PIN_ACTIONS.ENABLE_TWO_FACTOR;
    edgeConfirmActionProps.onSuccess = onSuccessDisable;
    edgeConfirmActionProps.onCancel = onCancelDisable;
    edgeConfirmActionProps.submitAction = submitDisable;
  }

  return (
    <SecurityItem {...securityItemProps}>
      <EdgeConfirmAction {...edgeConfirmActionProps} />
      <DangerModal {...dangerModalProps} />
      <SuccessModal {...successModalProps} />
    </SecurityItem>
  );
};

export default TwoFactorAuth;

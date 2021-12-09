import React, { useState } from 'react';

import SecurityItem from '../SecurityItem';
import SuccessModal from '../../../../components/Modal/SuccessModal';
import DangerModal from '../../../../components/Modal/DangerModal';
import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';

import apis from '../../../../api';
import { minWaitTimeFunction } from '../../../../utils';

import { SubmitActionParams } from '../../../../components/EdgeConfirmAction/types';

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

const MIN_WAIT_TIME = 2000;

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

  const [submitData, setSubmitData] = useState<boolean | null>(null);
  const [showDisableModal, toggleDisableModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, toggleLoading] = useState(false);

  const submitDisable = async ({ edgeAccount }: SubmitActionParams) => {
    toggleLoading(true);
    toggleDisableModal(true);
    try {
      await minWaitTimeFunction(
        () => apis.edge.disableTwoFactorAuth(edgeAccount),
        MIN_WAIT_TIME,
      );
      toggleTwoFactorAuth(false);
      toggleLoading(false);
    } catch (e) {
      console.error(e);
      showGenericErrorModal();
      toggleLoading(false);
    }
  };

  const onSuccessDisable = () => {
    setProcessing(false);
    toggleDisableModal(false);
    toggleSuccessModal(true);
  };

  const onCancelDisable = () => {
    setSubmitData(null);
    setProcessing(false);
    toggleDisableModal(false);
  };

  const submitEnable = async ({ edgeAccount }: SubmitActionParams) => {
    toggleLoading(true);
    try {
      await minWaitTimeFunction(
        () => apis.edge.enableTwoFactorAuth(edgeAccount),
        MIN_WAIT_TIME,
      );
      toggleTwoFactorAuth(true);
      toggleLoading(false);
    } catch (e) {
      console.error(e);
      showGenericErrorModal();
      toggleLoading(false);
    }
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
    toggleSuccessModal(false);
  };

  const securityItemProps = {
    title: ITEM_PROPS.title,
    subtitle: ITEM_PROPS.subtitle,
    loading: loading || processing,
    isGreen: hasTwoFactorAuth,

    // set changeable props
    buttonText: 'Enable',
    attentionText: '',
    onClick: () => setSubmitData(true),
  };

  const successModalProps = {
    onClose: onSuccessClose,
    showModal: showSuccessModal,

    // set changeable props
    title: ITEM_PROPS.successDisableModalTitle,
    subtitle: ITEM_PROPS.successDisableModalSubtitle,
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

  if (hasTwoFactorAuth) {
    // security props
    securityItemProps.buttonText = 'Disable';
    securityItemProps.attentionText = ITEM_PROPS.attentionText;
    securityItemProps.onClick = () => toggleDisableModal(true);

    // success modal props
    successModalProps.title = ITEM_PROPS.successEnableModalTitle;
    successModalProps.subtitle = ITEM_PROPS.successEnableModalSubtitle;

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

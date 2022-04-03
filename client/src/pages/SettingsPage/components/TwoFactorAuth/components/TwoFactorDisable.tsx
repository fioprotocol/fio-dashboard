import React, { useState } from 'react';

import SecurityItem from '../../SecurityItem';
import SuccessModal from '../../../../../components/Modal/SuccessModal';
import DangerModal from '../../../../../components/Modal/DangerModal';
import EdgeConfirmAction from '../../../../../components/EdgeConfirmAction';
import BackupCode from './BackupCode';

import { CONFIRM_PIN_ACTIONS } from '../../../../../constants/common';

import apis from '../../../../../api';
import { minWaitTimeFunction } from '../../../../../utils';
import { log } from '../../../../../util/general';

import { SubmitActionParams } from '../../../../../components/EdgeConfirmAction/types';
import { TwoFactorComponentProps } from '../types';

import { ITEM_PROPS, MIN_WAIT_TIME } from '../constants';

const TwoFactorDisable: React.FC<TwoFactorComponentProps> = props => {
  const {
    securityItemProps,
    successModalProps,
    edgeConfirmActionProps,
    genericErrorIsShowing,
    loading,
    processing,
    onSuccessClose,
    showGenericErrorModal,
    toggleLoading,
    setProcessing,
    toggleSuccessModal,
  } = props;

  const [showDisableModal, toggleDisableModal] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const disabledSecurityItemProps = {
    ...securityItemProps,
    loading: loading || processing,
    buttonText: 'Disable',
    additionalElements: <BackupCode />,
    attentionText: ITEM_PROPS.attentionText,
    onClick: () => toggleDisableModal(true),
  };

  const disabledSuccessModalProps = {
    ...successModalProps,
    onClose: () => onSuccessClose(false),
    title: ITEM_PROPS.successDisableModalTitle,
    subtitle: ITEM_PROPS.successDisableModalSubtitle,
  };

  const onDisableClose = () => toggleDisableModal(false);
  const onDisableClick = () => {
    toggleDisableModal(false);
    setSubmitData(true);
  };

  const onSuccess = () => {
    setProcessing(false);
    toggleDisableModal(false);
    toggleSuccessModal(true);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
    toggleDisableModal(false);
  };

  const submitAction = async ({ edgeAccount }: SubmitActionParams) => {
    toggleLoading(true);
    toggleDisableModal(true);
    try {
      await minWaitTimeFunction(
        () => apis.edge.disableTwoFactorAuth(edgeAccount),
        MIN_WAIT_TIME,
      );
    } catch (e) {
      log.error(e);
      showGenericErrorModal();
    }

    toggleLoading(false);
    setSubmitData(null);
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

  const disabledEdgeConfirmActionProps = {
    ...edgeConfirmActionProps,
    data: submitData,
    action: CONFIRM_PIN_ACTIONS.DISABLE_TWO_FACTOR,
    onSuccess,
    onCancel,
    submitAction,
  };

  return (
    <SecurityItem {...disabledSecurityItemProps}>
      <EdgeConfirmAction {...disabledEdgeConfirmActionProps} />
      <SuccessModal {...disabledSuccessModalProps} />
      <DangerModal {...dangerModalProps} />
    </SecurityItem>
  );
};

export default TwoFactorDisable;

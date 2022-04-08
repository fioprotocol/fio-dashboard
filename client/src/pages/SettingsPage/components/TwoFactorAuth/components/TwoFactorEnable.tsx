import React, { useState } from 'react';

import SecurityItem from '../../SecurityItem';
import SuccessModal from '../../../../../components/Modal/SuccessModal';
import EdgeConfirmAction from '../../../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../../../constants/common';

import apis from '../../../../../api';
import { minWaitTimeFunction } from '../../../../../utils';
import { log } from '../../../../../util/general';

import { SubmitActionParams } from '../../../../../components/EdgeConfirmAction/types';

import { ITEM_PROPS, MIN_WAIT_TIME } from '../constants';

import { TwoFactorComponentProps } from '../types';

const TwoFactorEnable: React.FC<TwoFactorComponentProps> = props => {
  const {
    securityItemProps,
    successModalProps,
    edgeConfirmActionProps,
    loading,
    processing,
    onSuccessClose,
    toggleLoading,
    setProcessing,
    toggleSuccessModal,
  } = props;

  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const enabledSecurityItemProps = {
    ...securityItemProps,
    loading: loading || processing,
    buttonText: 'Enable',
    attentionText: '',
    onClick: () => setSubmitData(true),
  };

  const enabledSuccessModalProps = {
    ...successModalProps,
    onClose: () => onSuccessClose(true),
    title: ITEM_PROPS.successEnableModalTitle,
    subtitle: ITEM_PROPS.successEnableModalSubtitle,
  };

  const submitAction = async ({ edgeAccount }: SubmitActionParams) => {
    toggleLoading(true);
    try {
      await minWaitTimeFunction(
        () => apis.edge.enableTwoFactorAuth(edgeAccount),
        MIN_WAIT_TIME,
      );
    } catch (e) {
      log.error(e);
    }

    toggleLoading(false);
    setSubmitData(null);
  };

  const onSuccess = () => {
    setProcessing(false);
    toggleSuccessModal(true);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const enabledEdgeConfirmActionProps = {
    ...edgeConfirmActionProps,
    data: submitData,
    action: CONFIRM_PIN_ACTIONS.ENABLE_TWO_FACTOR,
    onSuccess,
    onCancel,
    submitAction,
  };

  return (
    <SecurityItem {...enabledSecurityItemProps}>
      <EdgeConfirmAction {...enabledEdgeConfirmActionProps} />
      <SuccessModal {...enabledSuccessModalProps} />
    </SecurityItem>
  );
};

export default TwoFactorEnable;

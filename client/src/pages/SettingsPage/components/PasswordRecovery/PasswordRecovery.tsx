import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';
import SuccessModal from '../../../../components/Modal/SuccessModal';
import DangerModal from '../../../../components/Modal/DangerModal';
import ResendEmail from '../ResendEmail';
import SecurityItem from '../SecurityItem';

import apis from '../../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';
import { minWaitTimeFunction } from '../../../../utils';

import { SubmitActionParams } from '../../../../components/EdgeConfirmAction/types';

import classes from '../../styles/PasswordRecovery.module.scss';

const ITEM_PROPS = {
  title: 'Password Recovery',
  subtitle: `Set up your password recovery, so you don't loose your account forever`,
  modalTitle: 'Confirm Recovery Questions',
  dangerTitle: 'Are You Sure?',
  dangerSubtitle:
    'This is required to recover your account in addition to your username and recovery questions.',
  successModalTitle: 'PASSWORD RECOVERY DISABLED',
  successModalSubtitle:
    'Your Password Recovery has been successfully disabled.',
};

type Props = {
  showRecoveryModal: () => void;
  changeRecoveryQuestionsOpen: () => void;
  username: string;
  hasRecoveryQuestions: boolean;
  checkRecoveryQuestions: (username: string) => void;
  loading: boolean;
  genericErrorIsShowing: boolean;
};

const PasswordRecovery: React.FC<Props> = props => {
  const {
    showRecoveryModal,
    changeRecoveryQuestionsOpen,
    checkRecoveryQuestions,
    hasRecoveryQuestions,
    username,
    loading,
    genericErrorIsShowing,
  } = props;

  const [submitData, setSubmitData] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showDisableModal, toggleDisableModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);

  useEffect(() => {
    username && checkRecoveryQuestions(username);
  }, []);

  const submit = async ({ edgeAccount }: SubmitActionParams) => {
    toggleDisableModal(true);
    return minWaitTimeFunction(
      () => apis.edge.disableRecovery(edgeAccount),
      2000,
    );
  };

  const onSuccess = (disableRecoveryResults: { status?: number }) => {
    if (disableRecoveryResults.status) {
      setProcessing(false);
      toggleDisableModal(false);
      toggleSuccessModal(true);
      checkRecoveryQuestions(username);
    } else {
      onCancel();
    }
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
    toggleDisableModal(true);
  };

  const onChangeRecoveryQuestions = () => {
    showRecoveryModal();
    changeRecoveryQuestionsOpen();
  };

  const onClick = () => {
    if (hasRecoveryQuestions) {
      toggleDisableModal(true);
    } else {
      onChangeRecoveryQuestions();
    }
  };

  const onDisableClick = () => {
    toggleDisableModal(false);
    setSubmitData(true);
  };

  const onDisableClose = () => toggleDisableModal(false);

  const onSuccessClose = () => {
    toggleSuccessModal(false);
  };

  const mainButtonText = hasRecoveryQuestions
    ? 'Disable Password Recovery'
    : 'Setup Password Recovery';

  /* eslint-disable */
  // @ts-ignore
  const renderChangeRecoveryButton = () => (
    <Button
      onClick={onChangeRecoveryQuestions}
      className={classes.changeButton}
    >
      Change Recovery Questions
    </Button>
  );

  const renderButtonGroup = ( // 'change recovery' button commented because of no design
    <>
      {/* {renderChangeRecoveryButton()} */}
      <ResendEmail />
    </>
  );

  return (
    <SecurityItem
      {...ITEM_PROPS}
      buttonText={mainButtonText}
      isGreen={hasRecoveryQuestions}
      onClick={onClick}
      bottomChildren={hasRecoveryQuestions && renderButtonGroup}
    >
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.DISABLE_PASSWORD_RECOVERY}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onCancel}
        processing={processing}
        hideProcessing={true}
        data={submitData}
        submitAction={submit}
      />
      <DangerModal
        show={showDisableModal && !genericErrorIsShowing}
        onClose={onDisableClose}
        onActionButtonClick={onDisableClick}
        buttonText={mainButtonText}
        showCancel={true}
        title={ITEM_PROPS.dangerTitle}
        subtitle={ITEM_PROPS.dangerSubtitle}
        loading={loading || processing}
      />
      <SuccessModal
        title={ITEM_PROPS.successModalTitle}
        subtitle={ITEM_PROPS.successModalSubtitle}
        onClose={onSuccessClose}
        showModal={showSuccessModal}
      />
    </SecurityItem>
  );
};

export default PasswordRecovery;

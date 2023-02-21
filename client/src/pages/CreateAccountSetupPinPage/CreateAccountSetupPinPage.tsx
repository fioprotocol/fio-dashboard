import React from 'react';
import { Form, FormRenderProps, FormSpy } from 'react-final-form';

import CancelButton from '../../components/common/CancelButton/CancelButton';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import DangerModal from '../../components/Modal/DangerModal';
import BackButton from '../../components/common/BackButton/BackButton';

import { PinComponent } from './components/PinComponent';
import { PinConfirmComponent } from './components/PinConfirmComponent';

import { setDataMutator } from '../../utils';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { useContext } from './CreateAccountSetupPinPageContext';

import classes from './CreateAccountSetupPinPage.module.scss';

const CreateAccountSetupPinPage: React.FC = () => {
  const {
    formRef,
    isConfirm,
    hasError,
    loading,
    processing,
    showWarningModal,
    submitData,
    handleForcedSkip,
    onBack,
    onCancel,
    onCloseDangerModal,
    onEdgeConfirmCancel,
    onPinChange,
    onSuccess,
    setProcessing,
    startOver,
    submit,
  } = useContext();

  return (
    <div className={classes.container}>
      <Form onSubmit={() => null} mutators={{ setDataMutator }}>
        {(formProps: FormRenderProps) => {
          formRef.current = formProps.form;
          return (
            <form className={classes.form}>
              <div className={classes.arrow}>
                <BackButton isWhite hide={!isConfirm} onClick={onBack} />
              </div>
              <PinComponent loading={loading} show={!isConfirm} />
              <PinConfirmComponent
                hasError={hasError}
                loading={loading}
                show={isConfirm}
                startOver={startOver}
              />
              <CancelButton onClick={onCancel} text="SKIP" withBottomMargin />
              <FormSpy onChange={onPinChange} />
            </form>
          );
        }}
      </Form>
      <DangerModal
        show={showWarningModal}
        buttonText="SKIP ANYWAY"
        title="Sure You Want to Skip?"
        subtitle="Your PIN is used to confirm certain transactions types. If you skip this step you will be required to fill in your password instead."
        onActionButtonClick={handleForcedSkip}
        onClose={onCloseDangerModal}
      />
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.SETUP_PIN}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onEdgeConfirmCancel}
        processing={processing}
        hideProcessing={true}
        data={submitData}
        submitAction={submit}
      />
    </div>
  );
};

export default CreateAccountSetupPinPage;

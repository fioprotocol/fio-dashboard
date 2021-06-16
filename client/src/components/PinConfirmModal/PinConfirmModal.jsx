import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';

import ModalComponent from '../Modal/Modal';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';

import { setDataMutator } from '../../utils';
import classes from './PinConfirmModal.module.scss';

const PinConfirmModal = props => {
  const {
    showPinConfirm,
    edgeContextSet,
    onSubmit,
    confirmingPin,
    onClose,
    username,
    pinConfirmation,
    resetPinConfirm,
  } = props;
  if (!showPinConfirm || !edgeContextSet) return null;
  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  let currentForm = {};
  useEffect(() => {
    if (!isEmpty(currentForm)) {
      const { mutators } = currentForm;

      if (!isEmpty(pinConfirmation.error)) {
        const pinErrorMessage = pinConfirmation.error.message;

        const retErrorMessage = /invalid password/gi.test(pinErrorMessage);

        mutators.setDataMutator('pin', {
          error: retErrorMessage
            ? 'Invalid PIN - Try Again'
            : pinConfirmation.error.message,
        });
      } else {
        mutators.setDataMutator('pin', {
          error: false,
        });
      }
    }
  }, [pinConfirmation]);

  const handleSubmit = values => {
    const { pin } = values;
    onSubmit({
      username,
      pin,
    });
  };

  const resetForm = () => {
    if (!isEmpty(currentForm)) {
      const { mutators, reset } = currentForm;
      reset();
      mutators.setDataMutator('pin', {
        error: false,
      });
      resetPinConfirm();
      const currentInput = document.getElementById('pin');
      currentInput && currentInput.focus();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderForm = props => {
    const { handleSubmit, form } = props;
    currentForm = form;
    const { values, errors, active } = currentForm.getState();

    const isAndroid = /Android/i.test(window.navigator.appVersion);

    const error = pinConfirmation.error || (errors && errors.pin);
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <FormHeader
          title="Confirm Purchase"
          isDoubleColor
          subtitle="Enter your 6 digit PIN to confirm this transaction"
          isSubNarrow
        />
        <Field
          name="pin"
          component={Input}
          disabled={confirmingPin}
          autoFocus
          autoComplete="off"
        />
        {!isDesktop && active && (
          <div
            className={
              isAndroid ? classes.androidKeyboard : classes.keyboardPlug
            }
          ></div>
        )}
        {confirmingPin && (
          <FontAwesomeIcon icon="spinner" spin className={classes.icon} />
        )}
        {!isEmpty(error) && values.pin && values.pin.length === 6 && (
          <Button className="w-100" onClick={resetForm}>
            Try Again
          </Button>
        )}
      </form>
    );
  };

  return (
    <ModalComponent
      show={showPinConfirm}
      backdrop="static"
      onClose={handleClose}
      closeButton
    >
      <Form onSubmit={handleSubmit} mutators={{ setDataMutator }}>
        {renderForm}
      </Form>
    </ModalComponent>
  );
};

export default PinConfirmModal;

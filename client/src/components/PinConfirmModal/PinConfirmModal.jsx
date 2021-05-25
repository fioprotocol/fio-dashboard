import React, { useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import { isEmpty } from 'lodash';
import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';

import ModalComponent from '../Modal/Modal';

import { setDataMutator } from '../../utils';

const PinConfirmModal = props => {
  const {
    showPinConfirm,
    edgeContextSet,
    onSubmit,
    loading,
    onClose,
    username,
    pinFailure,
  } = props;
  if (!showPinConfirm || !edgeContextSet) return null;
  let currentForm = {};
  useEffect(() => {
    if (!isEmpty(currentForm) && !isEmpty(pinFailure)) {
      const { mutators } = currentForm;

      mutators.setDataMutator('pin', {
        error: true,
        hideError: true,
      });
    }
  }, [pinFailure]);

  const handleSubmit = values => {
    const { pin } = values;
    onSubmit({
      username,
      pin,
    });
  };

  const renderForm = props => {
    const { handleSubmit, form } = props;
    currentForm = form;
    return (
      <form onSubmit={handleSubmit}>
        <FormHeader title="Enter PIN" isDoubleColor />
        <Field name="pin" component={Input} disabled={loading} />
      </form>
    );
  };

  return (
    <ModalComponent
      show={showPinConfirm}
      backdrop="static"
      onClose={onClose}
      closeButton
    >
      <Form onSubmit={handleSubmit} mutators={{ setDataMutator }}>
        {renderForm}
      </Form>
    </ModalComponent>
  );
};

export default PinConfirmModal;

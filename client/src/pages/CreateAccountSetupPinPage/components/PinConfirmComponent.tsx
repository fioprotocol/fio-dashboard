import React from 'react';
import { Button } from 'react-bootstrap';
import { Field } from 'react-final-form';

import FormHeader from '../../../components/FormHeader/FormHeader';
import PinInput from '../../../components/Input/PinInput/PinInput';
import Loader from '../../../components/Loader/Loader';

import { FIELD_NAMES } from '../../../components/PinForm/PinForm';

type Props = {
  hasError: boolean;
  loading: boolean;
  show: boolean;
  startOver: () => void;
};

export const PinConfirmComponent: React.FC<Props> = props => {
  const { hasError, loading, show, startOver } = props;

  if (!show) return null;

  return (
    <>
      <FormHeader
        title="Confirm PIN"
        subtitle="Enter a 6 digit PIN to use for sign in and transaction approvals"
        hasBigTopMargin
      />
      <Field
        name={FIELD_NAMES.CONFIRM_PIN}
        component={PinInput}
        disabled={loading}
        autoFocus
        autoComplete="off"
      />
      {loading && (
        <div className="mb-4">
          <Loader />
        </div>
      )}
      {hasError && (
        <Button className="w-100" onClick={startOver}>
          START OVER
        </Button>
      )}
    </>
  );
};

import React from 'react';
import { Field } from 'react-final-form';

import FormHeader from '../../../components/FormHeader/FormHeader';
import PinInput from '../../../components/Input/PinInput/PinInput';

import { FIELD_NAMES } from '../../../components/PinForm/PinForm';

type Props = {
  loading: boolean;
  show: boolean;
};

export const PinComponent: React.FC<Props> = props => {
  const { loading, show } = props;

  if (!show) return null;

  return (
    <>
      <FormHeader
        title="Enter PIN"
        subtitle="Create a 6 digit PIN to use for sign in and transaction approvals"
        hasBigTopMargin
      />
      <Field
        name={FIELD_NAMES.PIN}
        component={PinInput}
        disabled={loading}
        autoFocus
        autoComplete="off"
      />
    </>
  );
};
